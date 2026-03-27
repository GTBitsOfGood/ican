import { Document, model, models, Schema, Types } from "mongoose";
import { ChildPasswordType } from "@/types/user";

export interface User {
  name: string;
  email: string;
  password?: string;
  childPassword?: string | null;
  childPasswordType?: ChildPasswordType;
  provider: string;
  isOnboarded?: boolean;
  tutorial_completed?: boolean;
  gameStreakDays?: number;
  gameCoinsEarnedToday?: number;
  gameLastPlayDate?: Date | null;
}

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    childPassword: { type: String, required: false, default: null },
    childPasswordType: {
      type: String,
      required: false,
      default: ChildPasswordType.NORMAL,
      enum: Object.values(ChildPasswordType),
    },
    provider: { type: String, required: true },
    isOnboarded: { type: Boolean, required: false, default: false },
    tutorial_completed: { type: Boolean, required: false, default: false },
    gameStreakDays: { type: Number, required: false, default: 0 },
    gameCoinsEarnedToday: { type: Number, required: false, default: 0 },
    gameLastPlayDate: { type: Date, required: false, default: null },
  },
  { timestamps: true },
);

const UserModel = models.User || model<UserDocument>("User", userSchema);

export default UserModel;
