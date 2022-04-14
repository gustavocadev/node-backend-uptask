import { Response, Request } from "express"
import { UserModel } from "../models/User"
import { UserType } from "../types/types"
import bcryptjs from "bcryptjs"
import { generateJWT } from "../helpers/generateJWT"

const signIn = async (req: Request<{}, {}, UserType>, res: Response) => {
  const { email, password } = req.body

  // Find user by email
  const user = await UserModel.findOne({ email })

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    })
  }

  // Check if password is correct
  const isMatch = await bcryptjs.compare(password, user.password)

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    })
  }

  // Check if user is verified
  if (!user.isconfirm) {
    return res.status(400).json({
      message: "User is not verified",
    })
  }

  // Create JWT
  const jwtCreated = await generateJWT({ id: user.id, name: user.name })
  res.json({
    email: user.email,
    name: user.name,
    _id: user._id,
    token: jwtCreated,
  })
}

export { signIn }
