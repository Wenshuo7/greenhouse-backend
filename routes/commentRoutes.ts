import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  createComment,
  updateCommentLikes,
  editComment,
  deleteComment,
} from "../controllers/commentsController";
const router = express.Router();

router.use(requireAuth);

router.post("/", createComment);
router.put("/", updateCommentLikes);
router.put("/edit", editComment);
router.delete("/", deleteComment);

export default router;
