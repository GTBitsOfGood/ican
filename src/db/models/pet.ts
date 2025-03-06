import { Document, model, models, Schema, Types } from "mongoose";

export interface Pet {
  petType: string;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: Types.ObjectId;
  appearance: {
    clothes?: string;
    accessories?: {
      shoes?: string;
      eyewear?: string;
      hat?: string;
      occupation?: string;
    };
    background?: string;
    food?: string;
  };
}

export interface PetDocument extends Pet, Document {
  _id: Types.ObjectId;
}

const petSchema = new Schema<PetDocument>({
  petType: { type: String, required: true },
  name: { type: String, required: true },
  xpGained: { type: Number, required: true },
  xpLevel: { type: Number, required: true },
  coins: { type: Number, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
  appearance: {
    type: new Schema({
      clothes: { type: String },
      accessories: {
        type: new Schema({
          shoes: { type: String },
          eyewear: { type: String },
          hat: { type: String },
          occupation: { type: String },
        }),
        default: {},
      },
      background: { type: String },
      food: { type: String },
    }),
    default: {},
  },
});

const PetModel = models.Pet || model<PetDocument>("Pet", petSchema);

export default PetModel;
