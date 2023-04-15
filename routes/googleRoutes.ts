import express from "express";
const router = express.Router();
import { User } from "../types";

import { loginGoogleUser } from "../utils/loginGoogleUser";
import { signupGoogle } from "../utils/registerGoogleUser";

import jwt from "jsonwebtoken";

const createToken = (_id: any) => {
  return jwt.sign({ _id }, process.env.SECRET!);
};

router.post("/signup", async (req, res) => {
  const { username, firstName, lastName, imageName } = req.body;

  try {
    await signupGoogle({
      username,
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
});

router.post("/login", async (req, res) => {
  try {
    const user: User = await loginGoogleUser(req.body);

    const token = createToken(user.id);

    user.following = JSON.parse(user?.following).map(Number);
    user.followers = JSON.parse(user?.followers).map(Number);
    user.saved = JSON.parse(user?.saved).map(Number);

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
});

export default router;
