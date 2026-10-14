import express from "express";
import { signIn, register, getNextStep } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);

router.get("/next-step", getNextStep)

export default router;