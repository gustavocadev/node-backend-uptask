import { Schema, model, Types } from 'mongoose'
import { ProjectType } from '../types/types'

const ProjectSchema = new Schema(
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
    deliveryDate: {
      type: String,
      default: String(Date.now()),
    },
    customer: {
      type: String,
      trim: true,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
    },
    // asi indico que sera un array de mongoid, y cada mongoid hara referencia a un modelo
    tasks: [
      {
        type: Types.ObjectId,
        ref: 'Task',
      }
    ],
    contributors: [
      {
        type: Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
)

export const ProjectModel = model<ProjectType>('Project', ProjectSchema)
