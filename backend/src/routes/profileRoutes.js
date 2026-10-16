
import express from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import {
  completeProfile,
  getMyProfile,
  getPendingProfiles,
  approveProfile,
  rejectProfile,
  getApprovedMembers,
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/complete", requireAuth, completeProfile);
router.get("/me", requireAuth, getMyProfile);
router.get("/members",requireAuth ,requireAdmin ,getApprovedMembers);
router.get('/pending', requireAuth, requireAdmin, getPendingProfiles)
router.patch('/:id/approve', requireAuth, requireAdmin, approveProfile)
router.patch('/:id/reject', requireAuth, requireAdmin, rejectProfile)

export default router;