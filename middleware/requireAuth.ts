import jwt from "jsonwebtoken";
import { knexInstance } from "../db";

export const requireAuth = async (req: any, res: any, next: any) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const id = jwt.verify(token, process.env.SECRET!) as {
      _id: 1;
      iat: 1680778076;
    };

    const [user] = await knexInstance.select().from("user").where("id", id._id);

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};
