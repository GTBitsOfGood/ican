import { Document, model, models, Schema, Types } from "mongoose";

// Interfaces

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

export interface MedicationCheckIn {
  medicationId: Types.ObjectId;
  expiration: Date;
}

export interface MedicationLog {
  medicationId: Types.ObjectId;
  dateTaken: Date;
}

export interface MedicationDocument extends Medication, Document {
  _id: Types.ObjectId;
}

export interface MedicationCheckInDocument extends MedicationCheckIn, Document {
  _id: Types.ObjectId;
}

export interface MedicationLogDocument extends MedicationLog, Document {
  _id: Types.ObjectId;
}

// Schemas

const medicationSchema = new Schema<MedicationDocument>(
  {
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
  },
  { timestamps: true },
);

medicationSchema.index({ userId: 1, medicationId: 1 }, { unique: true });

const medicationCheckInSchema = new Schema<MedicationCheckInDocument>(
  {
    medicationId: { type: Schema.ObjectId, ref: "Medication", required: true },
    expiration: { type: Date, required: true },
  },
  { timestamps: true },
);

const medicationLogSchema = new Schema<MedicationLogDocument>(
  {
    medicationId: { type: Schema.ObjectId, ref: "Medication", required: true },
    dateTaken: { type: Date, required: true },
  },
  { timestamps: true },
);

// Models

export const MedicationModel =
  models.Medication ||
  model<MedicationDocument>("Medication", medicationSchema);

export const MedicationCheckInModel =
  models.MedicationCheckIn ||
  model<MedicationCheckInDocument>(
    "MedicationCheckIn",
    medicationCheckInSchema,
  );

export const MedicationLogModel =
  models.MedicationLog ||
  model<MedicationLogDocument>("MedicationLog", medicationLogSchema);
