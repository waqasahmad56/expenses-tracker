import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/user.interface";

export interface IUserDocument extends Document, Omit<IUser, "_id"> {}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// UserSchema.index({ email: 1 });

export default mongoose.model<IUserDocument>("User", UserSchema);
