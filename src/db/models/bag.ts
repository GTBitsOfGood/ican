import { model, models, Schema, Types } from "mongoose";

export interface BagItem {
  petId: Types.ObjectId;
  itemName: string;
}

export interface BagItemDocument extends BagItem, Document {
  _id: Types.ObjectId;
}

const bagItemSchema = new Schema<BagItemDocument>(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
      index: true,
      immutable: true,
    },
    itemName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

bagItemSchema.index({ petId: 1, itemName: 1 }, { unique: true });

const BagItemModel =
  models.BagItem || model<BagItemDocument>("BagItem", bagItemSchema);

export default BagItemModel;
