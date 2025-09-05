import express from "express";
import {
  getMyProfile,
  googleAuthSuccess,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import passport from "passport";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();

// ========== MANUAL AUTHENTICATION ROUTES ==========
router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getMyProfile);

// ========== GOOGLE OAUTH ROUTES ==========
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.CLIENT_URL + "/login?error=auth_failed",
    session: false, // We'll use JWT instead of sessions
  }),
  googleAuthSuccess
);
router.post("/logout", isAuthenticated, logout);
export default router;
