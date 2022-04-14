import jwt from "jsonwebtoken"

type Props = {
  id?: string
  email?: string
  name?: string
}

export const generateJWT = (data: Props) => {
  return new Promise((resolve, reject) => {
    const payload = {
      ...data,
    }
    const jwtCreated = jwt.sign(payload, process.env.JWT_SECRET ?? "", {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    })
    if (!jwtCreated) return reject("Error creating JWT")
    resolve(jwtCreated)
  })
}
