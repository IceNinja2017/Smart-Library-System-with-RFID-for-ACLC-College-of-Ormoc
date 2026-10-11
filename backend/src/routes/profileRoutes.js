
import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  completeProfile,
  getMyProfile,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/complete", requireAuth, completeProfile);
router.get("/me", requireAuth, getMyProfile);

export default router;