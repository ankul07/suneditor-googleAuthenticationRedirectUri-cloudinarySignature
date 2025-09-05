import express from "express";
import {
  getCloudinarySignature,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/signature", isAuthenticated, getCloudinarySignature);
router.put("/profile-update", isAuthenticated, updateProfile);
export default router;
