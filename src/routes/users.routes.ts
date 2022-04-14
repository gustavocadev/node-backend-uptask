import { Router } from "express"
import { getUsers, createUser } from "../controllers"
import { check } from "express-validator"
import { isEmailAvailable, validateErrors } from "../helpers/validators"

const router = Router()
// GET /users
router.get("/", getUsers)

// POST /users
router.post(
  "/",
  [
    check("email").custom((email: string) => isEmailAvailable(email)),
    validateErrors,
  ],
  createUser
)

export default router
