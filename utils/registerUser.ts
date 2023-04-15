import bcrypt from "bcrypt";
import validator from "validator";
import validateLength from "./validateLength";
import validateAlpha from "./validateAlpha";
import { knexInstance } from "../db";

export type signUserProps = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  image: string;
};

export const signup = async ({
  username,
  password,
  firstName,
  lastName,
  image,
}: signUserProps) => {
  if (!username || !password || !firstName || !lastName) {
    throw new Error("All fields must be filled");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  validateLength(username, "Username");
  validateLength(password, "Password");
  validateLength(firstName, "FirstName");
  validateLength(lastName, "LastName");
  validateLength(username, "Username");
  validateAlpha(firstName, "FirstName");
  validateAlpha(lastName, "LastName");

  username = validator.escape(validator.trim(username));
  password = validator.escape(validator.trim(password));
  firstName = validator.escape(validator.trim(firstName));
  lastName = validator.escape(validator.trim(lastName));

  const results = await knexInstance("user")
    .count("* as count")
    .where("username", username);

  const count = results[0].count as number;

  if (count > 0) {
    throw new Error("username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  await knexInstance("user").insert({
    username: username,
    password: hash,
    firstName: firstName,
    lastName: lastName,
    imageUrl: image,
    followers: JSON.stringify([]),
    following: JSON.stringify([]),
    saved: JSON.stringify([]),
  });
};
