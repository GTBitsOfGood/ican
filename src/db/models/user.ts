import { Document, model, models, Schema, Types } from "mongoose";

export interface User {
  name: string;
  email: string;
  password?: string;
  provider: string;
}

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    provider: { type: String, required: true },
  },
  { timestamps: true },
);

const UserModel = models.User || model<UserDocument>("User", userSchema);

export default UserModel;
