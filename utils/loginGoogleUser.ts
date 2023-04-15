import { knexInstance } from "../db";


type loginUserProps = {
  username: string;
  token: string;
};

export const loginGoogleUser = async ({ username }: loginUserProps) => {
  if (!username) {
    throw new Error("All fields must be filled");
  }

  const [user] = await knexInstance
    .select()
    .from("user")
    .where("email", username);

  if (!user) {
    throw new Error("Wrong username");
  }

  return user;
};
