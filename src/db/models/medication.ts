import { Document, model, models, Schema, Types } from "mongoose";
import { MedicationInfo } from "@/types/medication";

export interface Medication extends MedicationInfo {
  userId: Types.ObjectId;
}

export interface MedicationDocument extends Medication, Document {
  _id: Types.ObjectId;
}

const medicationSchema = new Schema<MedicationDocument>({
  formOfMedication: { type: String, required: true },
  customMedicationId: { type: String, required: true },
  repeatInterval: { type: Number, required: true },
  repeatUnit: { type: String, required: true },
  repeatWeeklyOn: { type: [String], required: true },
  repeatMonthlyType: { type: String, required: false },
  repeatMonthlyOnDay: { type: Number, required: false },
  repeatMonthlyOnWeek: { type: Number, required: false },
  repeatMonthlyOnWeekDay: { type: String, required: false },
  dosesUnit: { type: String, required: true },
  dosesPerDay: { type: Number, required: false },
  doseIntervalInHours: { type: Number, required: false },
  dosageAmount: { type: String, required: true },
  doseTimes: { type: [String], required: true },
  notificationFrequency: { type: String, required: true },
  notes: { type: String, required: false },
  includeTimes: { type: Boolean, required: true },
  userId: {
    type: Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
    immutable: true,
  },
});

medicationSchema.index({ userId: 1, customMedicationId: 1 }, { unique: true });

// Models

export const MedicationModel =
  models.Medication ||
  model<MedicationDocument>("Medication", medicationSchema);
