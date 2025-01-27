import { ObjectId } from "mongodb";

export interface ForgotPasswordCode {
  _id?: ObjectId;
  code: string;
  expirationDate: Date;
  userId: string;
}
