import { knexInstance } from "../db";

export const getNotificationsByReceiverId = async (req: any, res: any) => {
  const { receiverId } = req.query;

  try {
    const notifications = await knexInstance("notification")
      .where("receiver", receiverId)
      .leftJoin("user as sender", "notification.sender", "sender.id")
      .select(
        "notification.*",
        "sender.id as senderId",
        "sender.username as username",
        "sender.imageUrl as imageUrl",
        "sender.authImage as authImage"
      )
      .orderBy("notification.createdAt", "desc");

    res.status(200).json(notifications);
  } catch (error) {
    res.staus(404).json({ msg: "Cannot find any any notifications" });
  }
};

export const updateUnreadNotifications = async (req: any, res: any) => {
  const { receiverId } = req.query;

  try {
    const notifications = await knexInstance("notification")
      .where("receiver", receiverId)
      .update({ read: 1 }, ["*"]);

    res.status(200).json({ msg: "Successfully updated" });
  } catch (error) {
    res.status(404).json({ msg: "Cannot find any any notifications" });
  }
};
