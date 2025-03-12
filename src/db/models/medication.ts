import { Document, model, models, Schema, Types } from "mongoose";

export interface Medication {
  formOfMedication: string;
  medicationId: string;

  repeatUnit: string;
  repeatInterval: number;
  repeatWeeklyOn: string[];
  repeatMonthlyType?: string;
  repeatMonthlyOnDay?: number;
  repeatMonthlyOnWeek: number;
  repeatMonthlyOnWeekDay: string;

  dosesUnit: string;
  dosesPerDay?: number;
  doseIntervalInHours?: number;
  dosageAmount: string;
  doseTimes: string[];

  notificationFrequency: string;
  notes?: string;
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
  repeatWeeklyOn: { type: [String], required: true },
  repeatMonthlyType: { type: String, required: false },
  repeatMonthlyOnDay: { type: Number, required: false },
  repeatMonthlyOnWeek: { type: Number, required: true },
  repeatMonthlyOnWeekDay: { type: String, required: true },
  dosesUnit: { type: String, required: true },
  dosesPerDay: { type: Number, required: true },
  doseIntervalInHours: { type: Number, required: false },
  dosageAmount: { type: String, required: true },
  doseTimes: { type: [String], required: true },
  notificationFrequency: { type: String, required: true },
  notes: { type: String, required: false },
  userId: { type: Schema.ObjectId, ref: "User", required: true, index: true },
});

medicationSchema.index({ userId: 1, medicationId: 1 }, { unique: true });

const MedicationModel =
  models.Medication ||
  model<MedicationDocument>("Medication", medicationSchema);

export default MedicationModel;
