import { Document, model, models, Schema, Types, UpdateQuery } from "mongoose";
import bcrypt from "bcrypt";

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

forgotPasswordCodeSchema.pre("save", async function (next) {
  if (this.isModified("code")) {
    this.code = await bcrypt.hash(this.code, 10);
  }
  next();
});

forgotPasswordCodeSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate() as UpdateQuery<ForgotPasswordCodeDocument>;
  if (update.code) {
    update.code = await bcrypt.hash(update.code, 10);
  }
  next();
});

const ForgotPasswordCodeModel =
  models.ForgotPasswordCode ||
  model<ForgotPasswordCodeDocument>(
    "ForgotPasswordCode",
    forgotPasswordCodeSchema,
  );

export default ForgotPasswordCodeModel;
