import { Request, Response } from "express";
import { signup } from "../utils/registerUser";
import { loginUser } from "../utils/loginUser";
import jwt from "jsonwebtoken";
import { knexInstance } from "../db";

import { User } from "../types";

import deleteImage from "../utils/deleteImage";

const createToken = (_id: any) => {
  return jwt.sign({ _id }, process.env.SECRET!, { expiresIn: "5d" });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, firstName, lastName, imageName } = req.body;

  try {
    await signup({
      username,
      password,
      firstName,
      lastName,
      image: imageName,
    });

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const user: User = await loginUser(req.body);

    const token = createToken(user.id);

    user.following = JSON.parse(user?.following).map(Number);
    user.followers = JSON.parse(user.followers).map(Number);
    user.saved = JSON.parse(user.saved).map(Number);

    console.log(user);

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const getUsers = async (req: any, res: any) => {
  try {
    const users = await knexInstance("user").select(
      "id",
      "username",
      "firstName",
      "lastName",
      "imageUrl",
      "followers",
      "following",
      "saved",
      "authImage"
    );

    users.forEach((user) => {
      user.following = JSON.parse(user?.following).map(Number);
      user.followers = JSON.parse(user.followers).map(Number);
      user.saved = JSON.parse(user.saved).map(Number);
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ msg: "Users cannot be found" });
  }
};

export const getUserById = async (req: any, res: any) => {
  const { userId } = req.params;

  try {
    const [user] = await knexInstance("user")
      .select(
        "id",
        "username",
        "firstName",
        "lastName",
        "imageUrl",
        "followers",
        "following",
        "saved",
        "authImage"
      )
      .where("id", userId);

    user.following = JSON.parse(user.following).map(Number);
    user.followers = JSON.parse(user.followers).map(Number);
    user.saved = JSON.parse(user.saved).map(Number);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ msg: "User unknown" });
  }
};

export const editUserInfo = async (req: any, res: any) => {
  const { username, firstName, lastName } = req.body;

  try {
    await knexInstance("user")
      .update({ username, firstName, lastName })
      .where("id", req.user.id);

    const [updatedUser] = await knexInstance("user")
      .select(
        "id",
        "username",
        "firstName",
        "lastName",
        "imageUrl",
        "following",
        "followers",
        "saved",
        "authImage"
      )
      .where("id", req.user.id);

    updatedUser.following = JSON.parse(updatedUser.following).map(Number);
    updatedUser.followers = JSON.parse(updatedUser.followers).map(Number);
    updatedUser.saved = JSON.parse(updatedUser.saved).map(Number);

    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const changeProfilePicture = async (req: any, res: any) => {
  const { imageName } = req.body;

  try {
    deleteImage(req.user.imageUrl);

    await knexInstance("user")
      .update({ imageUrl: imageName })
      .where("id", req.user.id);

    const [updatedUser] = await knexInstance("user")
      .select(
        "id",
        "username",
        "firstName",
        "lastName",
        "imageUrl",
        "following",
        "followers",
        "saved",
        "authImage"
      )
      .where("id", req.user.id);

    updatedUser.following = JSON.parse(updatedUser.following).map(Number);
    updatedUser.followers = JSON.parse(updatedUser.followers).map(Number);
    updatedUser.saved = JSON.parse(updatedUser.saved).map(Number);

    res
      .status(200)
      .json({ message: "Your photo was successfully updated", updatedUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const deleteProfilePicture = async (req: any, res: any) => {
  const { imageName } = req.body;

  try {
    deleteImage(imageName);

    await knexInstance("user")
      .update({ imageUrl: "" })
      .where("id", req.user.id);

    const [updatedUser] = await knexInstance("user")
      .select(
        "id",
        "username",
        "firstName",
        "lastName",
        "imageUrl",
        "following",
        "followers",
        "saved",
        "authImage"
      )
      .where("id", req.user.id);

    updatedUser.following = JSON.parse(updatedUser.following).map(Number);
    updatedUser.followers = JSON.parse(updatedUser.followers).map(Number);
    updatedUser.saved = JSON.parse(updatedUser.saved).map(Number);

    res.status(200).json({
      message: "Your photo was successfully deleted",
      updatedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const updateUserFollowStatus = async (req: any, res: any) => {
  const { userId } = req.body;

  try {
    await knexInstance("user")
      .where("id", "=", req.user.id)
      .update({
        following: knexInstance.raw(
          `CASE
        WHEN JSON_SEARCH(following, 'one', CAST(? AS CHAR)) IS NOT NULL THEN
            JSON_REMOVE(following, JSON_UNQUOTE(JSON_SEARCH(following, 'one', CAST(? AS CHAR))))
        ELSE
            JSON_ARRAY_APPEND(following, '$', CAST(? AS CHAR))
        END`,
          [userId, userId, userId]
        ),
      });

    await knexInstance("user")
      .update({
        followers: knexInstance.raw(`CASE
        WHEN JSON_SEARCH(followers, 'one', CAST(${req.user.id} AS CHAR)) IS NOT NULL THEN
            JSON_REMOVE(followers, JSON_UNQUOTE(JSON_SEARCH(followers, 'one', CAST(${req.user.id} AS CHAR))))
        ELSE
            JSON_ARRAY_APPEND(followers, '$', CAST(${req.user.id} AS CHAR))
        END
      `),
      })
      .where("id", userId);

    const [user] = await knexInstance("user as u")
      .select(
        "u.id",
        "u.username",
        "u.firstName",
        "u.lastName",
        "u.imageUrl",
        "u.authImage",
        "u.followers",
        "u.following",
        "u.saved"
      )
      .where("u.id", userId);

    user.following = JSON.parse(user.following).map(Number);
    user.followers = JSON.parse(user.followers).map(Number);
    user.saved = JSON.parse(user.saved).map(Number);

    return res.status(200).json({ user });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};
