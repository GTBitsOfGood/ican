import { ObjectId } from "mongodb";

export interface Pet {
  _id?: ObjectId;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: ObjectId;
}
