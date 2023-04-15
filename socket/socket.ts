import { Server } from "socket.io";

import express from "express";
const app = express();
import http from "http";
import { knexInstance } from "../db";
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://greenhouse-frontend.vercel.app", /* provide the hosted frontend url when you do so */
    methods: ["GET", "POST"],
  },
});

// redis
let users: { userId: number; socketId: string }[] = [];

const addUser = (userId: number, socketId: string) => {
  if (!users?.some((user) => user?.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId: number) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("add_user", ({ userId }) => {
    addUser(userId, socket.id);
  });

  socket.on("getOnlineUsers", () => {
    io.emit("online-users", users);
  });

  socket.on(
    "send_notification",
    async ({ senderId, receiverId, action, message }) => {
      const user = getUser(receiverId);
      const sender = await knexInstance("user")
        .select(
          "username",
          "email",
          "firstName",
          "lastName",
          "authImage",
          "followers",
          "following",
          "saved"
        )
        .where({ id: senderId })
        .first();

      const formattedDate = new Date().toString();

      await knexInstance("notification").insert({
        receiver: receiverId,
        sender: senderId,
        message: message,
        action: action,
        read: 0,
        createdAt: formattedDate,
      });

      if (user?.userId) {
        io.in(user.socketId).emit("receive_notification", {
          sender: senderId,
          receiver: receiverId,
          action,
          message,
          read: 0,
          createdAt: new Date(),
        });
      }
    }
  );

  socket.on("send_message", ({ senderId, receiverId, message, time }) => {
    const user = getUser(receiverId);
    if (user) {
      io.in(user.socketId).emit("notification_message", {
        senderId,
        message,
        receiverId,
        time,
        unread: true,
      });
    }
  });

  socket.on("send_message", ({ senderId, receiverId, message, time }) => {
    const user = getUser(receiverId);
    if (user) {
      io.in(user.socketId).emit("receive_message", {
        senderId,
        message,
        receiverId,
        time,
        unread: true,
      });
    }
  });

  socket.on("remove_user", ({ userId }) => {
    users = users.filter((user) => user.userId !== userId);
  });
});

export { server, app };
