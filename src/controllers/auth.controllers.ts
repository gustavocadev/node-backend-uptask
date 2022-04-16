import { Response, Request } from "express";
import { UserModel } from "../models/User";
import { UserType } from "../types/types";
import bcryptjs from "bcryptjs";
import { generateJWT } from "../helpers/generateJWT";
import { randomUUID } from "crypto";

const signIn = async (req: Request<{}, {}, UserType>, res: Response) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  // Check if password is correct
  const isMatch = await bcryptjs.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  // Check if user is verified
  if (!user.isconfirm) {
    return res.status(400).json({
      message: "User is not verified",
    });
  }

  // Create JWT
  const jwtCreated = await generateJWT({ id: user.id, name: user.name });
  res.json({
    email: user.email,
    name: user.name,
    _id: user._id,
    token: jwtCreated,
  });
};

const verifyToken = async (req: Request<{ token: string }>, res: Response) => {
  const { token } = req.params;
  const userVerify = await UserModel.findOne({ token }).lean();

  if (!userVerify) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  try {
    await UserModel.findByIdAndUpdate(
      userVerify._id,
      { isconfirm: true, token: "" },
      { new: true }
    );

    res.json({
      message: "user verified successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req: Request<{}, {}, UserType>, res: Response) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });

  // Check if user exists
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  try {
    await UserModel.findOneAndUpdate(
      { email },
      { token: randomUUID() },
      { new: true }
    );

    res.json({
      message: "We have sent you an email to reset your password",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyTokenPassword = async (
  req: Request<{ token: string }, {}, UserType>,
  res: Response
) => {
  const { token } = req.params;

  const validTokenPassword = await UserModel.findOne({ token }).lean();

  if (!validTokenPassword) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  res.json({
    message: "Token is valid and can be used to reset password",
  });
};
const createNewPassword = async (
  req: Request<{ token: string }, {}, UserType>,
  res: Response
) => {
  const { token } = req.params;
  const { password } = req.body;

  const userValidToken = await UserModel.findOne({ token }).lean();

  if (!userValidToken) {
    return res.status(400).json({
      message: "Invalid token",
    });
  }

  const salt = await bcryptjs.genSalt(10);
  const passwordHashed = await bcryptjs.hash(password, salt);

  await UserModel.findByIdAndUpdate(userValidToken._id, {
    password: passwordHashed,
    token: "",
  });

  res.json({
    message: "Password has been reset successfully",
  });
};

export {
  signIn,
  verifyToken,
  resetPassword,
  verifyTokenPassword,
  createNewPassword,
};
