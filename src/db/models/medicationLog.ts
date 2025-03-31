import { Types, Schema, models, model } from "mongoose";

export interface MedicationLog {
  medicationId: Types.ObjectId;
  dateTaken: Date;
}

export interface MedicationLogDocument extends MedicationLog, Document {
  _id: Types.ObjectId;
}

const medicationLogSchema = new Schema<MedicationLogDocument>(
  {
    medicationId: { type: Schema.ObjectId, ref: "Medication", required: true },
    dateTaken: { type: Date, required: true },
  },
  { timestamps: true },
);

export const MedicationLogModel =
  models.MedicationLog ||
  model<MedicationLogDocument>("MedicationLog", medicationLogSchema);
