import path from "path";
import dotenv from "dotenv";

// Environment setup
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

import app from "./app.js";
import connectDatabase from "./config/db.js";

const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Server start
    const PORT = process.env.PORT || 9010;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  }
};

startServer();
