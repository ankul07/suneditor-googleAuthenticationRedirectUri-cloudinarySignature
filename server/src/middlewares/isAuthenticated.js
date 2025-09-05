import asyncHandler from "./asyncHandler.js";
import User from "../models/user.schema.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const { suneditorToken } = req.cookies;
  // console.log(suneditorToken);
  if (!suneditorToken) return next(new AppError("Not Logged In", 401));

  const decoded = jwt.verify(
    suneditorToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );
  req.user = await User.findById(decoded.id);

  next();
});
