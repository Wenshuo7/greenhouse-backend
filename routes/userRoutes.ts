import express from "express";
import { requireAuth } from "../middleware/requireAuth";
import {
  registerUser,
  login,
  getUsers,
  getUserById,
  updateUserFollowStatus,
  editUserInfo,
  deleteProfilePicture,
  changeProfilePicture,
} from "../controllers/userController";
import { uploadImage } from "../utils/uploadImage";
const router = express.Router();

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/signup", uploadImage.single("imageUrl"), registerUser);
router.post("/login", login);

router.use(requireAuth);
router.put("/", updateUserFollowStatus);
router.put("/edit", editUserInfo);
router.put("/photo", uploadImage.single("imageUrl"), changeProfilePicture);
router.delete("/photo", deleteProfilePicture);
export default router;
