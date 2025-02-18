import { ObjectId } from "mongodb";

export enum Provider {
  GOOGLE = "google",
  PASSWORD = "password",
}

export interface User {
  _id?: ObjectId;
  provider: Provider;
  name: string;
  email: string;
  password: string;
}
