import express from "express";
import { signIn, getNextStep, registerUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/register", registerUser);

router.get("/next-step", getNextStep)

export default router;