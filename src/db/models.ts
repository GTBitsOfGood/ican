import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordCode {
  _id?: ObjectId;
  code: string;
  expirationDate: Date;
  userId: ObjectId;
}

export interface Pet {
  _id?: ObjectId;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: ObjectId;
}

export interface Medication {
  _id?: ObjectId;
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
  userId: ObjectId;
}
