import { Document, model, models, Schema, Types } from "mongoose";
import { ChildPasswordType } from "@/types/user";
import { GameResult, GameStats } from "@/types/games";

export interface User {
  name: string;
  email: string;
  password?: string;
  childPassword?: string | null;
  childPasswordType?: ChildPasswordType;
  provider: string;
  isOnboarded?: boolean;
  tutorial_completed?: boolean;
  gameStatistics?: Map<string, GameStats>;
  gameCoinsEarnedToday?: number;
  gameCoinsLastResetDate?: Date;
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
    gameCoinsEarnedToday: { type: Number, default: 0 },
    gameCoinsLastResetDate: { type: Date, default: null },
    gameStatistics: {
      type: Map,
      of: new Schema<GameStats>(
        {
          wins: { type: Number, default: 0 },
          losses: { type: Number, default: 0 },
          draws: { type: Number, default: 0 },
          bestWinStreak: { type: Number, default: 0 },
          currentWinStreak: { type: Number, default: 0 },
          lastTenResults: {
            type: [{ type: String, enum: Object.values(GameResult) }],
            default: [],
          },
        },
        { _id: false },
      ),
      default: () => ({}),
    },
  },
  { timestamps: true },
);

const UserModel = models.User || model<UserDocument>("User", userSchema);

export default UserModel;
