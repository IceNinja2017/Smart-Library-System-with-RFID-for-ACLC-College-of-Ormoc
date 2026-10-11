import express from "express";
import { signIn, register } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/signin", signIn);

export default router;