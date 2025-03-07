import { Document, model, models, Schema, Types } from "mongoose";

export interface Medication {
  formOfMedication: string;
  medicationId: string;
  repeatInterval: number;
  repeatUnit: string;
  repeatOn: string[];
  repeatMonthlyOnDay: number;
  notificationFrequency: string;
  dosesPerDay: number;
  doseIntervalInHours: number;
  // string of times
  doseTimes: string[];
  userId: Types.ObjectId;
}

export interface MedicationDocument extends Medication, Document {
  _id: Types.ObjectId;
}

const medicationSchema = new Schema<MedicationDocument>({
  formOfMedication: { type: String, required: true },
  medicationId: { type: String, required: true },
  repeatInterval: { type: Number, required: true },
  repeatUnit: { type: String, required: true },
  repeatOn: { type: [String], required: true },
  repeatMonthlyOnDay: { type: Number, required: true },
  notificationFrequency: { type: String, required: true },
  dosesPerDay: { type: Number, required: true },
  doseIntervalInHours: { type: Number, required: true },
  doseTimes: { type: [String], required: true },
  userId: { type: Schema.ObjectId, ref: "User", required: true, index: true },
});

medicationSchema.index({ userId: 1, medicationId: 1 }, { unique: true });

const MedicationModel =
  models.Medication ||
  model<MedicationDocument>("Medication", medicationSchema);

export default MedicationModel;
