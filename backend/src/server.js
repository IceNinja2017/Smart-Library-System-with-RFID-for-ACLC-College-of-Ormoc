
import "dotenv/config";
import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
//import prisma from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

app.set('etag', false)
app.use(express.json());

// Test endpoint
app.get("/api/health", (req, res) => {
  res.json({ message: "Smart Library API is running!" });
});

app.use("/api/profiles", profileRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Smart Library API running on port ${PORT}`);
});
