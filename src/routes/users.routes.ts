import { Router } from "express";
import { getUsers, createUser, userProfile } from "../controllers";
import { check } from "express-validator";
import { isEmailAvailable, validateErrors } from "../helpers/validators";
import { isAuth } from "../middlewares";

const router = Router();
// GET /users
router.get("/", getUsers);

// POST /users
router.post(
  "/",
  [check("email").custom(isEmailAvailable), validateErrors],
  createUser
);

router.get("/profile", isAuth, userProfile);

export default router;
