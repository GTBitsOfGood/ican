import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface Pet {
  _id?: ObjectId;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: ObjectId;
}
