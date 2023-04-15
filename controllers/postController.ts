import { Request, Response } from "express";
import validateCaption from "../utils/validateCaption";

import { knexInstance } from "../db";

export const getPosts = async (req: any, res: Response) => {
  const { page } = req.query;

  try {
    const posts = await knexInstance
      .select(
        "p.*",
        "u.id",
        "p.id AS postId",
        "u.username",
        "u.imageUrl AS userImage",
        "u.authImage",
        "p.imageUrl"
      )
      .from("post as p")
      .join("user as u", "p.createdBy", "u.id")
      .orderBy("p.id", "desc")
      .limit(5)
      .offset(page * 5);

    posts.forEach((post) => {
      post.likes = JSON.parse(post.likes).map(Number);
      post.imageUrl = JSON.parse(post.imageUrl);
      post.types = JSON.parse(post.types);
    });
    const numberOfPosts = await knexInstance("post").count("*", {
      as: "posts",
    });

    res.status(200).json({ posts, numberOfPosts: numberOfPosts[0].posts });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const getPostsByUserId = async (req: any, res: any) => {
  const { userId } = req.params;

  try {
    const posts = await knexInstance("post")
      .select(
        "post.*",
        "user.id",
        "post.id as postId",
        "user.username",
        "user.imageUrl as userImage",
        "user.authImage",
        "post.imageUrl"
      )
      .join("user", "post.createdBy", "=", "user.id")
      .where("post.createdBy", userId)
      .orderBy("post.id", "desc");

    posts.forEach((post) => {
      post.likes = JSON.parse(post.likes).map(Number);
      post.imageUrl = JSON.parse(post.imageUrl);
      post.types = JSON.parse(post.types);
    });

    res.status(200).json(posts);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const getPostById = async (req: any, res: any) => {
  const { postId } = req.params;

  try {
    const [post] = await knexInstance("post as p")
      .join("user as u", "p.createdBy", "u.id")
      .select(
        "p.*",
        "u.id",
        "p.id as postId",
        "u.username",
        "u.imageUrl as userImage",
        "u.authImage",
        "p.imageUrl"
      )
      .where("p.id", postId)
      .orderBy("p.id", "desc");

    post.likes = JSON.parse(post.likes).map(Number);
    post.imageUrl = JSON.parse(post.imageUrl);
    post.types = JSON.parse(post.types);

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const createPost = async (req: any, res: Response) => {
  const { text, imageNames, types } = req.body;

  const imageNamesJson = JSON.stringify(imageNames);
  const typesJson = JSON.stringify(types);
  const formattedDate = new Date().toString();

  try {
    const newText = validateCaption(text);

    await knexInstance("post").insert({
      text: newText,
      createdAt: formattedDate,
      imageUrl: imageNamesJson,
      createdBy: req.user.id,
      likes: JSON.stringify([]),
      types: typesJson,
    });

    const [post] = await knexInstance
      .select(
        "p.*",
        "u.id",
        "p.id as postId",
        "u.username",
        "u.imageUrl as userImage",
        "u.authImage",
        "p.imageUrl"
      )
      .from("post as p")
      .join("user as u", "p.createdBy", "u.id")
      .orderBy("p.id", "desc")
      .limit(1);

    post.likes = JSON.parse(post.likes).map(Number);
    post.imageUrl = JSON.parse(post.imageUrl);
    post.types = JSON.parse(post.types);

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const updateLikes = async (req: any, res: any) => {
  const { postId } = req.body;

  try {
    await knexInstance("post")
      .update(
        "likes",
        knexInstance.raw(`CASE
      WHEN JSON_SEARCH(likes, 'one', CAST(${req.user.id} AS CHAR)) IS NOT NULL THEN
          JSON_REMOVE(likes, JSON_UNQUOTE(JSON_SEARCH(likes, 'one', CAST(${req.user.id} AS CHAR))))
      ELSE
          JSON_ARRAY_APPEND(likes, '$', CAST(${req.user.id} AS CHAR))
      END`)
      )
      .where("id", postId);

    const [post] = await knexInstance
      .select(
        "p.*",
        "u.id",
        "p.id as postId",
        "u.username",
        "u.imageUrl as userImage",
        "u.authImage",
        "p.imageUrl"
      )
      .from("post as p")
      .join("user as u", "p.createdBy", "u.id")
      .where("p.id", postId)
      .orderBy("p.id", "desc");

    post.likes = JSON.parse(post.likes).map(Number);
    post.imageUrl = JSON.parse(post.imageUrl);
    post.types = JSON.parse(post.types);

    res.status(200).json({ msg: "Success", post });
  } catch (error) {
    res.status(400).json({ msg: "No such post" });
  }
};

export const getSpecificPostComments = async (req: any, res: any) => {
  const { postId } = req.params;

  try {
    const comments = await knexInstance
      .select(
        "comment.id",
        "comment.comment",
        "comment.createdAt",
        "comment.likes",
        "user.id AS userId",
        "user.username AS username",
        "user.imageUrl AS userImage",
        "user.authImage",
        "comment.post as postId"
      )
      .from("comment")
      .join("user", "comment.createdBy", "=", "user.id")
      .where("comment.post", "=", postId);

    comments.forEach((comment) => {
      comment.likes = JSON.parse(comment.likes).map(Number);
    });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(400).json({ error: "No such comments" });
  }
};
