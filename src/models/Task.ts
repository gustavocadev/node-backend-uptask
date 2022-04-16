import { Schema, model, Types } from "mongoose";
import { TaskType } from "../types/types";

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    state: {
      type: Boolean,
      default: false,
    },
    deliveryDate: {
      type: String,
      required: true,
      default: Date.now().toString(),
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    project: {
      type: Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

export const TaskModel = model<TaskType>("Task", TaskSchema);
