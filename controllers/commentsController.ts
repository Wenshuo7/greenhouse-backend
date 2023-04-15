import validateComment from "../utils/validateComment";
import { knexInstance } from "../db";

export const createComment = async (req: any, res: any) => {
  const { comment, postId } = req.body;

  const formattedDate = new Date().toString();

  try {
    let validatedComment = validateComment(comment);

    await knexInstance("comment").insert({
      comment: validatedComment,
      createdAt: formattedDate,
      post: postId,
      createdBy: req.user.id,
      likes: JSON.stringify([]),
    });

    return res.status(200).json({ message: "Comment created" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const updateCommentLikes = async (req: any, res: any) => {
  const { postId } = req.body;

  try {
    await knexInstance("comment")
      .update(
        "likes",
        knexInstance.raw(`CASE
      WHEN JSON_SEARCH(likes, 'one', CAST(${req.user.id} AS CHAR)) IS NOT NULL THEN
          JSON_REMOVE(likes, JSON_UNQUOTE(JSON_SEARCH(likes, 'one', CAST(${req.user.id} AS CHAR))))
      ELSE
          JSON_ARRAY_APPEND(likes, '$', CAST(${req.user.id} AS CHAR))
      END`)
      )
      .where("post", postId);

    const [post] = await knexInstance
      .select(
        "p.*",
        "u.id",
        "p.id as postId",
        "u.username",
        "u.imageUrl as userImage",
        "p.imageUrl",
        "u.authImage"
      )
      .from("post as p")
      .join("user as u", "p.createdBy", "u.id")
      .where("p.id", postId);

    post.imageUrl = JSON.parse(post.imageUrl);
    post.likes = JSON.parse(post.likes).map(Number);

    res.status(200).json({ msg: "Success", post: post });
  } catch (error) {
    res.status(400).json({ msg: "No such post" });
  }
};

export const editComment = async (req: any, res: any) => {
  const { commentId, comment } = req.body;

  try {
    const validatedComment = validateComment(comment);

    await knexInstance("comment").where("id", commentId).update({
      comment: validatedComment,
    });

    const [newComment] = await knexInstance("comment")
      .where("id", commentId)
      .select("*");

    res.status(200).json({ msg: "Success", newComment });
  } catch (error) {
    res.status(400).json({ msg: "No such comment" });
  }
};

export const deleteComment = async (req: any, res: any) => {
  const { commentId } = req.body;

  try {
    await knexInstance("comment").where("id", commentId).del();
    return res.status(200).json({ msg: "Success" });
  } catch (error) {
    return res.status(400).json({ error: "unable to delete the comment" });
  }
};
