import express from "express";
import { uploadImage } from "../utils/uploadImage";
const router = express.Router();
import {
  getStories,
  getStoryById,
  createStory,
} from "../controllers/storyController";
import { requireAuth } from "../middleware/requireAuth";

router.get("/", getStories);

router.get("/:storyId", getStoryById);

router.post("/", requireAuth, uploadImage.array("content"), createStory);

export default router;
