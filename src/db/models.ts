import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  provider: string;
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
  petType: string;
  name: string;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: ObjectId;
  appearance: {
    clothes?: ObjectId;
    accessories?: ObjectId;
    background?: ObjectId;
    food?: ObjectId;
  };
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

export interface BagItem {
  _id?: ObjectId;
  petId: ObjectId;
  itemName: string;
}

export interface Settings {
  _id: ObjectId;
  userId: ObjectId;
  parentalControl: boolean;
  notifications: boolean;
  helpfulTips: boolean;
  largeFontSize: boolean;
  pin: string;
}
