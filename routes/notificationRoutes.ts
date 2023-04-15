import express from "express";

import {
  getNotificationsByReceiverId,
  updateUnreadNotifications,
} from "../controllers/notificationsController";
const router = express.Router();

router.get("/", getNotificationsByReceiverId);
router.put("/", updateUnreadNotifications);

export default router;
