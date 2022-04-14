import { connect } from "mongoose"

const dbConnect = async () => {
  try {
    console.log("Connecting to MongoDB...")
    await connect(process.env.MONGO_URI ?? "")
    console.log("Connected to MongoDB!")
  } catch (error) {
    console.log(error)
  }
}

export { dbConnect }
