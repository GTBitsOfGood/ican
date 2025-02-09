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

export interface Pet {
  _id?: ObjectId;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: ObjectId;
}

export interface Settings {
  userId: ObjectId;
  parentalControl: boolean;
  notifications: boolean;
  helpfulTips: boolean;
  largeFontSize: boolean;
  pin: string;
}
