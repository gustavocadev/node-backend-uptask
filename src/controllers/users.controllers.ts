import { Request, Response } from "express"
import { UserModel } from "../models/User"
import { UserType } from "../types/types"
import bcryptjs from "bcryptjs"
import { randomUUID } from "crypto"

const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().lean()
    res.json(users)
  } catch (error) {
    console.log(error)
  }
}

const createUser = async (req: Request<{}, {}, UserType>, res: Response) => {
  try {
    // destructuring the req.body
    const { name, email, password, ...body } = req.body

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const passwordHashed = await bcryptjs.hash(password, salt)

    // Create user
    const newUser = {
      name,
      email,
      password: passwordHashed,
      token: randomUUID(),
    }

    // create the model instance
    const user = new UserModel(newUser)

    // Save user
    const userCreated = await user.save()

    // Send response
    res.json(userCreated)
  } catch (error) {
    console.log(error)
  }
}

export { getUsers, createUser }
