import AppError from "../utils/AppError.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import sendToken from "../utils/sendToken.js";
import User from "../models/user.schema.js";

// ========== GOOGLE AUTHENTICATION CONTROLLER ==========
export const googleAuthSuccess = asyncHandler(async (req, res, next) => {
  try {
    // 1. User should be present from Passport.js session
    const user = req.user;

    if (!user) {
      return next(new AppError("Authentication failed", 401));
    }

    // 2. Optional: Update login count and last login
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      $inc: { loginCount: 1 },
    });

    // 3. Generate access and refresh tokens (usually JWT)
    // const accessToken = user.getAccessToken();
    const token = user.getRefreshToken();

    // 4. Set refresh token in cookie
    res.cookie("suneditorToken", token, {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      httpOnly: true,
      // secure: true,
      // sameSite: "none",
    });

    // redirect without query params
    const frontendURL = process.env.CLIENT_URL;
    return res.redirect(`${frontendURL}/auth/success`);
  } catch (error) {
    // console.error("Google Auth Error:", error);
    return next(new AppError("Authentication failed", 500));
  }
});

export const getMyProfile = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // 🧹 Remove unwanted fields using destructuring
  const {
    passwordResetToken,
    passwordResetExpires,
    emailVerificationToken,
    emailVerificationExpires,
    __v,
    ...safeUser
  } = user._doc; // ⚠️ important: Mongoose document se plain object chahiye

  res.status(200).json({
    success: true,
    data: safeUser,
  });
});

// ========== MANUAL AUTHENTICATION CONTROLLER ==========
export const register = asyncHandler(async (req, res, next) => {
  res.send("hello madam");
});

export const login = asyncHandler(async (req, res, next) => {
  res.send("hello madam");
});
export const logout = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user;
    console.log("visited");
    // Clear the authentication cookie
    res.clearCookie("suneditorToken", {
      httpOnly: true,
      // secure: true,
      // sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // console.error("Logout Error:", error);
    return next(new AppError("Logout failed", 500));
  }
});
