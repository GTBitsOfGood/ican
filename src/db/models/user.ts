import { Document, model, models, Schema, Types, UpdateQuery } from "mongoose";
import bcrypt from "bcrypt";

export interface User {
  name: string;
  email: string;
  password?: string;
  provider: string;
}

export interface UserDocument extends User, Document {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  provider: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password === undefined) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate() as UpdateQuery<UserDocument>;
  if (update?.password) {
    update.password = await bcrypt.hash(update.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = models.User || model<UserDocument>("User", userSchema);

export default UserModel;
