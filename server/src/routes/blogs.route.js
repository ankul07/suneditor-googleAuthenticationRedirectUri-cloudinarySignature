import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  blogById,
  createBlog,
  publishedBlogs,
  userBlogs,
} from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/create-blog", isAuthenticated, createBlog);
router.get("/getblogs", publishedBlogs);
router.get("/userblog", isAuthenticated, userBlogs);
router.get("/:id", blogById);

export default router;
