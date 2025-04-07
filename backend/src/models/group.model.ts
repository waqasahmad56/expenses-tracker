import mongoose, { Schema, Document } from "mongoose";
import { IGroup } from "../interfaces/group.interface";

export interface IGroupDocument extends Document, Omit<IGroup, "_id"> {}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

GroupSchema.index({ name: 1 });

export default mongoose.model<IGroupDocument>("Group", GroupSchema);
