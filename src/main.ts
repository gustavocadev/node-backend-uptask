import express from "express"
import helloRoutes from "./routes/hello.routes"
import morgan from "morgan"
import { dbConnect } from "./utils/dbConnect"
import { config } from "dotenv"

const app = express()

// Load environment variables from .env file
config()

// connect to MongoDB
dbConnect()

// middlewares
app.use(express.json()) // to allow parsing json data from the request body
app.use(morgan("dev")) // to log all requests

// routes
app.use(helloRoutes) // to use the hello routes

// to start the server
const PORT = process.env.PORT ?? 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🎉`)
})
