import { Schema, model, Model } from "mongoose"
import { UserType } from "../types/types"

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    isconfirm: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export const UserModel: Model<UserType> = model("User", UserSchema)
