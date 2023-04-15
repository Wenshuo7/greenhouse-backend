import validator from "validator";
import { knexInstance } from "../db";

export type signUserProps = {
  username: string;
  firstName: string;
  lastName: string;
  image: string;
};

export const signupGoogle = async ({
  username,
  firstName,
  lastName,
  image,
}: signUserProps) => {
  if (!username) {
    throw new Error("All fields must be filled");
  }

  username = validator.escape(validator.trim(username));
  firstName = validator.escape(validator.trim(firstName));
  lastName = validator.escape(validator.trim(lastName));

  const results = await knexInstance("user")
    .count("* as count")
    .where("username", username);

  const count = results[0].count as number;

  if (count > 0) {
    throw new Error("Username already in use");
  }

  const newUsername = (lastName + firstName).toLocaleLowerCase();

  await knexInstance("user").insert({
    username: newUsername,
    email: username,
    firstName: firstName,
    lastName: lastName,
    authImage: image,
    followers: JSON.stringify([]),
    following: JSON.stringify([]),
    saved: JSON.stringify([]),
  });
};
