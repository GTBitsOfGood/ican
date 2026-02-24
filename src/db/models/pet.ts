import { Document, model, models, Schema, Types } from "mongoose";

export interface Appearance {
  clothing?: string;
  shoes?: string;
  eyewear?: string;
  hat?: string;
  occupation?: string;
  background?: string;
}

export interface SavedOutfit extends Appearance {
  name: string;
}

export interface Pet {
  petType: string;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: Types.ObjectId;
  food: number;
  lastFedAt: Date | null;
  appearance: Appearance;
  outfits: SavedOutfit[];
  currentStreak: number;
  longestStreak: number;
  perfectWeeksCount: number;
  lastDoseDate: Date | null;
}

const appearanceSchema = new Schema<Appearance>(
  {
    clothing: { type: String },
    shoes: { type: String },
    eyewear: { type: String },
    hat: { type: String },
    occupation: { type: String },
    background: { type: String },
  },
  { _id: false },
);

const savedOutfitSchema = new Schema<SavedOutfit>(
  {
    name: { type: String, required: true },
    clothing: { type: String },
    shoes: { type: String },
    eyewear: { type: String },
    hat: { type: String },
    occupation: { type: String },
    background: { type: String },
  },
  { _id: false },
);

export interface PetDocument extends Pet, Document {
  _id: Types.ObjectId;
}
const petSchema = new Schema<PetDocument>(
  {
    petType: { type: String, required: true },
    name: { type: String, required: true },
    xpGained: { type: Number, required: true, default: 0 },
    xpLevel: { type: Number, required: true, default: 1 },
    coins: { type: Number, required: true, default: 0 },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "User",
      immutable: true,
    },
    food: {
      type: Number,
      required: true,
      default: 0,
    },
    lastFedAt: {
      type: Date,
      default: null,
    },
    appearance: {
      type: appearanceSchema,
      default: {},
    },
    outfits: {
      type: [savedOutfitSchema],
      default: [],
    },
    currentStreak: {
      type: Number,
      required: true,
      default: 0,
    },
    longestStreak: {
      type: Number,
      required: true,
      default: 0,
    },
    perfectWeeksCount: {
      type: Number,
      required: true,
      default: 0,
    },
    lastDoseDate: {
      type: Date,
      required: false,
      default: null,
    },
  },
  { timestamps: true },
);

const PetModel = models.Pet || model<PetDocument>("Pet", petSchema);

export default PetModel;
