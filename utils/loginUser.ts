import bcrypt from "bcrypt";
import { knexInstance } from "../db";

type loginUserProps = {
  username: string;
  password: string;
};

export const loginUser = async ({ username, password }: loginUserProps) => {
  if (!username || !password) {
    throw new Error("All fields must be filled");
  }

  const [user] = await knexInstance
    .select()
    .from("user")
    .where("username", username);

  if (!user) {
    throw new Error("Wrong username");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new Error("Wrong password");
  }

  return user;
};
