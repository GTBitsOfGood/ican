import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordCode {
  _id?: ObjectId;
  code: string;
  expirationDate: Date;
  userId: ObjectId;
}
