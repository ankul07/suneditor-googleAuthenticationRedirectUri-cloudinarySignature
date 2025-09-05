import express from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(passport.initialize());

// API test route
app.get("/test", (req, res) => {
  res.json({ message: "Backend Running Successfully!" });
});

// Routes import
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blogs.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// Global error handler
app.use(globalErrorHandler);

export default app;
