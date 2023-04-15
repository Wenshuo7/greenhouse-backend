import { knexInstance } from "../db";
import { Response } from "express";

export async function getChatHistory(req: any, res: Response) {
  const { author, receiver } = req.query;
  try {
    const chatHistory = await knexInstance("chat").where(function () {
      this.whereJsonSupersetOf("members", [
        parseInt(author),
        parseInt(receiver),
      ]).orWhereJsonSupersetOf("members", [
        parseInt(receiver),
        parseInt(author),
      ]);
    });

    res.status(200).json(chatHistory);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Not available data" });
  }
}

export async function createNewMessage(req: any, res: Response) {
  const formattedDate = new Date().toString();
  try {
    const newMessage = {
      ...req.body,
      members: JSON.stringify(req.body.members),
      createdAt: formattedDate,
    };

    await knexInstance("chat").insert(newMessage);

    res.status(200).json({ msg: "Successfully created new message" });
  } catch (error) {
    res.status(400).json({ msg: "Unable to create new message" });
  }
}
