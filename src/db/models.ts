import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  provider: string;
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

export interface Pet {
  _id?: ObjectId;
  petType: string;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: ObjectId;
}
