import express from 'express'
import userRoute from './routes/users.routes'
import authRoute from './routes/auth.routes'
import projectRoute from './routes/projects.routes'
import taskRoute from './routes/tasks.routes'
import morgan from 'morgan'
import { dbConnect } from './utils/dbConnect'
import { config } from 'dotenv'
import cors from 'cors'

const app = express()

// Load environment variables from .env file
config()

// connect to MongoDB
dbConnect()

// middlewares
app.use(cors()) // to allow cross-origin requests
app.use(express.json()) // to allow parsing json data from the request body
app.use(morgan('dev')) // to log all requests

// routes
app.use('/api/users', userRoute) // to use the users routes
app.use('/api/auth', authRoute) // to use the auth routes
app.use('/api/projects', projectRoute) // to use the projects routes
app.use('/api/tasks', taskRoute) // to use the tasks routes

// to start the server
const PORT = process.env.PORT ?? 4000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT} 🎉`)
})
