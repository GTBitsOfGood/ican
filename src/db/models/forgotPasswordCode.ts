import { Document, model, models, Schema, Types } from "mongoose";

export interface ForgotPasswordCode {
  code: string;
  expirationDate: Date;
  userId: Types.ObjectId;
}

export interface ForgotPasswordCodeDocument
  extends ForgotPasswordCode,
    Document {
  _id: Types.ObjectId;
}

const forgotPasswordCodeSchema = new Schema<ForgotPasswordCodeDocument>({
  code: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  userId: { type: Schema.ObjectId, required: true, index: true, ref: "User" },
});

const ForgotPasswordCodeModel =
  models.ForgotPasswordCode ||
  model<ForgotPasswordCodeDocument>(
    "ForgotPasswordCode",
    forgotPasswordCodeSchema,
  );

export default ForgotPasswordCodeModel;
