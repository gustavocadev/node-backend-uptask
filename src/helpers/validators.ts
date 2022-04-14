import { validationResult } from "express-validator"
import { Request, NextFunction, Response } from "express"
import { UserModel } from "../models/User"

const validateErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  next()
}

const isEmailAvailable = async (email: string) => {
  const existsEmail = await UserModel.findOne({ email })
  if (existsEmail) {
    throw new Error("Email already in use")
  }
  return true
}

export { validateErrors, isEmailAvailable }
