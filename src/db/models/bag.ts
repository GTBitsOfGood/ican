import { model, models, ObjectId, Schema } from "mongoose";

export interface BagItem {
  petId: ObjectId;
  itemName: string;
}

export interface BagItemDocument extends BagItem, Document {
  _id: ObjectId;
}

const bagItemSchema = new Schema(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

bagItemSchema.index({ petId: 1, itemName: 1 }, { unique: true });

const BagItemModel =
  models.BagItem || model<BagItemDocument>("BagItem", bagItemSchema);

export default BagItemModel;
