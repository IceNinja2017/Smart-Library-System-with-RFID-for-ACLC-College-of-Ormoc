
import "dotenv/config";
import express from "express";
import prisma from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json());

//temp
app.get("/", (req, res) => {
  res.json({
    message: "Smart Library API is running",
  });
});

//temp
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      database: "Connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Smart Library API running on port ${PORT}`);
});
