import { Router } from "express"
import { check } from "express-validator"
import { signIn } from "../controllers"

const router = Router()

// POST /auth/login
router.post("/login", signIn)

export default router
