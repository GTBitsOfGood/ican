import { Types, Schema, models, model } from "mongoose";

export interface MedicationCheckIn {
  medicationId: Types.ObjectId;
  expiration: Date;
}

export interface MedicationCheckInDocument extends MedicationCheckIn, Document {
  _id: Types.ObjectId;
}

const medicationCheckInSchema = new Schema<MedicationCheckInDocument>(
  {
    medicationId: {
      type: Schema.ObjectId,
      ref: "Medication",
      required: true,
      immutable: true,
    },
    expiration: { type: Date, required: true },
  },
  { timestamps: true },
);

export const MedicationCheckInModel =
  models.MedicationCheckIn ||
  model<MedicationCheckInDocument>(
    "MedicationCheckIn",
    medicationCheckInSchema,
  );
