import express from "express";
import { uploadImage } from "../utils/uploadImage";
const router = express.Router();
import {
  createPost,
  getPosts,
  getPostById,
  updateLikes,
  getSpecificPostComments,
  getPostsByUserId,
} from "../controllers/postController";
import { requireAuth } from "../middleware/requireAuth";

router.get("/", getPosts);

router.get("/:userId", getPostsByUserId);
router.get("/p/:postId", getPostById);
router.get("/:postId/comments", getSpecificPostComments);

router.post("/", requireAuth, uploadImage.array("images[]"), createPost);

router.put("/", requireAuth, updateLikes);

export default router;
