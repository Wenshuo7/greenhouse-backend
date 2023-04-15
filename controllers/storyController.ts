import { knexInstance } from "../db";
import { Response } from "express";

export const getStories = async (req: any, res: Response) => {
  try {
    const stories = await knexInstance
      .select("s.*", "u.username", "u.imageUrl AS userImage", "u.authImage")
      .from("story as s")
      .join("user as u", "s.userId", "u.id")
      .orderBy("s.id", "desc");

    res.status(200).json({ stories });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const getStoryById = async (req: any, res: any) => {
  const { storyId } = req.params;

  try {
    const [story] = await knexInstance("story as s")
      .join("user as u", "s.userId", "u.id")
      .select("s.*", "u.username", "u.imageUrl as userImage", "u.authImage")
      .where("s.id", storyId)
      .orderBy("s.id", "desc");

    res.status(200).json(story);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const createStory = async (req: any, res: Response) => {
  const { contentName, type } = req.body;

  const formattedDate = new Date().toString();

  try {
    await knexInstance("story").insert({
      content: contentName,
      createdAt: formattedDate,
      userId: req.user.id,
      type,
    });

    const [story] = await knexInstance
      .select("s.*", "u.username", "u.imageUrl as userImage", "u.authImage")
      .from("story as s")
      .join("user as u", "s.userId", "u.id")
      .orderBy("s.id", "desc")
      .limit(1);

    res.status(200).json(story);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};
