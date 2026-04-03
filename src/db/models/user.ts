import { Document, model, models, Schema, Types } from "mongoose";
import {
  ChildPasswordType,
  INITIAL_TUTORIAL_STAGES,
  InitialTutorialStage,
} from "@/types/user";
import { GameResult, GameStats } from "@/types/games";

export interface User {
  name: string;
  email: string;
  password?: string;
  childPassword?: string | null;
  childPasswordType?: ChildPasswordType;
  provider: string;
  isOnboarded?: boolean;
  initialTutorialStage?: InitialTutorialStage;
  gameCoinsEarnedToday?: number;
  gameCoinsLastResetDate?: Date | null;
  gameStatistics?: Map<string, GameStats>;
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
    initialTutorialStage: {
      type: String,
      required: false,
      default: "food",
      enum: INITIAL_TUTORIAL_STAGES,
    },
    gameCoinsEarnedToday: { type: Number, required: false, default: 0 },
    gameCoinsLastResetDate: { type: Date, required: false, default: null },
    gameStatistics: {
      type: Map,
      of: new Schema<GameStats>(
        {
          wins: { type: Number, default: 0 },
          losses: { type: Number, default: 0 },
          draws: { type: Number, default: 0 },
          currentStreak: { type: Number, default: 0 },
          bestStreak: { type: Number, default: 0 },
          lastPlayedDate: { type: String, default: null },
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
