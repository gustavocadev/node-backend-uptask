import { Router } from "express";
import { check } from "express-validator";
import {
  signIn,
  verifyToken,
  resetPassword,
  verifyTokenPassword,
  createNewPassword,
} from "../controllers";
import { validateErrors } from "../helpers";

const router = Router();

// POST /auth/login
router.post("/login", signIn);

router.get("/verify/:token", verifyToken);

// forgot password
router.post("/reset-password", resetPassword);

router.get("/reset-password/:token", verifyTokenPassword);
router.post(
  "/reset-password/:token",
  [
    check("password", "password is too short").isLength({ min: 6 }),
    validateErrors,
  ],
  createNewPassword
);
export default router;
