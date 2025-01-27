import bcrypt from "bcrypt";
import { User } from "../db/models";

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export async function validateCreateUser(body: CreateUserBody) {
  if (body.password != body.confirmPassword) {
    throw new Error("password does not equal confirm password");
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const newUser: User = {
    name: body.name,
    email: body.email,
    password: hashedPassword,
  };

  const token = await createUser(newUser);

  return { token };
}
