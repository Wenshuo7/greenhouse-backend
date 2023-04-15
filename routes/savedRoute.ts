import express from "express";
import { requireAuth } from "../middleware/requireAuth";
const router = express.Router();
import {
  getSavedItemsByUserId,
  updateSavedPosts,
} from "../controllers/savedController";

router.use(requireAuth);
router.get("/", getSavedItemsByUserId);

router.put("/", updateSavedPosts);

export default router;
