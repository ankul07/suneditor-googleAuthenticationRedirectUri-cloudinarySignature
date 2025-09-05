import path from "path";
import dotenv from "dotenv";

// Environment setup
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });
}

import app from "./app.js";
import connectDatabase from "./config/db.js";

// Connect to database
connectDatabase();

export default app;

// For local development
if (process.env.NODE_ENV !== "PRODUCTION") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}
