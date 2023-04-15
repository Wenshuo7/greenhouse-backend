import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.get("/", (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET!) as JwtPayload;

    if (decoded?.exp! <= Date.now() / 1000) {
      throw new Error("token expired");
    }

    res.status(200).json({ message: "valid token" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    }
  }
});

export default router;
