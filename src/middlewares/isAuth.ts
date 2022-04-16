import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Props as PayloadUser } from "../helpers/generateJWT";
import { UserModel } from "../models/User";
import { RequestWithUser } from "../types/types";

const isAuth = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      message: "Access denied. No token provided.",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? "secret"
    ) as PayloadUser;

    if (!payload) {
      return res.status(401).json({
        message: "Access denied. Invalid token.",
      });
    }
    const user = await UserModel.findById(payload.id)
      .select("-password -isconfirm -token -__v")
      .lean();

    if (!user) {
      return res.status(401).json({
        message: "Access denied. User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Something went wrong. Invalid token.",
    });
  }
};

export { isAuth };
