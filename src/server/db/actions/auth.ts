import client from "../dbClient";
import nJwt from "njwt";
import { User } from "../models";
import bcrypt from "bcrypt";
import { LoginBody } from "@/server/service/auth";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function createUser(newUser: User) {
  const db = client.db();

  const existingUser = await db
    .collection("users")
    .findOne({ email: newUser.email });

  if (existingUser) {
    throw new Error("user already exists");
  }

  const newUserDb = await db.collection("users").insertOne(newUser);

  const jwt = nJwt.create(
    {
      userId: newUserDb.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
    },
    JWT_SECRET,
  );
  jwt.setExpiration(new Date().getTime() + 60 * 60 * 1000);

  return jwt;
}

export async function checkLogin(login: LoginBody) {
  const db = client.db();

  const existingUser = await db
    .collection("users")
    .findOne({ email: login.email });

  if (!existingUser) {
    throw new Error("user does not exist");
  }

  const passwordMatch = await bcrypt.compare(
    login.password,
    existingUser.password,
  );

  if (!passwordMatch) {
    throw new Error("password is not correct");
  }

  const jwt = nJwt.create(
    {
      userId: existingUser._id.toString(),
      name: existingUser.name,
      email: existingUser.email,
    },
    JWT_SECRET,
  );
  jwt.setExpiration(new Date().getTime() + 60 * 60 * 1000);

  return jwt;
}
