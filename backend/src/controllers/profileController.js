
import prisma from "../config/database.js";

export const completeProfile = async (req, res) => {
  try {
    // 1. Validate request body
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        error: "INVALID_REQUEST_BODY",
        message: "Request body is required and must be a JSON object.",
        example: {
          fullName: "John Doe",
          contactNumber: "09123456789",
          usn: "YOUR_USN",
          requestedRole: "STUDENT",
        },
      });
    }

    const { fullName, contactNumber, usn, requestedRole } = req.body;

    // 2. Validate required fields
    if (typeof fullName !== "string" || !fullName.trim()) {
      return res.status(400).json({
        error: "FULL_NAME_REQUIRED",
        message: "Full name is required and must be a non-empty string.",
      });
    }

    if (typeof requestedRole !== "string" ||
        !["STUDENT", "TEACHER"].includes(requestedRole)) {
      return res.status(400).json({
        error: "INVALID_REQUESTED_ROLE",
        message: "requestedRole must be either STUDENT or TEACHER.",
        allowedValues: ["STUDENT", "TEACHER"],
      });
    }

    if (
      contactNumber !== undefined &&
      contactNumber !== null &&
      typeof contactNumber !== "string"
    ) {
      return res.status(400).json({
        error: "INVALID_CONTACT_NUMBER",
        message: "contactNumber must be a string or null.",
      });
    }

    if (
      usn !== undefined &&
      usn !== null &&
      typeof usn !== "string"
    ) {
      return res.status(400).json({
        error: "INVALID_USN",
        message: "usn must be a string or null.",
      });
    }

    // 3. Verify authenticated user
    if (!req.user?.id) {
      return res.status(401).json({
        error: "UNAUTHENTICATED",
        message: "A valid authenticated user is required to complete a profile.",
      });
    }

    // 4. Check whether the profile already exists
    const existing = await prisma.profile.findUnique({
      where: { id: req.user.id },
    });

    if (existing) {
      return res.status(409).json({
        error: "PROFILE_ALREADY_EXISTS",
        message: "A profile already exists for this user.",
      });
    }

    // 5. Create profile
    const profile = await prisma.profile.create({
      data: {
        id: req.user.id,
        fullName: fullName.trim(),
        contactNumber:
          typeof contactNumber === "string"
            ? contactNumber.trim() || null
            : null,
        usn: typeof usn === "string" ? usn.trim() || null : null,
        requestedRole,
        role: "PENDING",
        approvalStatus: "PENDING",
      },
    });

    return res.status(201).json({
      message: "Profile submitted for approval.",
      profile,
    });
  } catch (error) {
    console.error("Profile creation error:", error);

    // 6. Handle known Prisma errors
    if (error.code === "P2002") {
      const target = error.meta?.target;

      return res.status(409).json({
        error: "UNIQUE_CONSTRAINT_VIOLATION",
        message: "A value that must be unique is already in use.",
        field: Array.isArray(target) ? target : target ?? "unknown",
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        error: "FOREIGN_KEY_CONSTRAINT_VIOLATION",
        message: "The profile references a related record that does not exist.",
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        error: "RECORD_NOT_FOUND",
        message: "A required database record was not found.",
      });
    }

    // 7. Unexpected errors
    return res.status(500).json({
      error: "PROFILE_CREATION_FAILED",
      message: "An unexpected error occurred while creating the profile.",
      ...(process.env.NODE_ENV !== "production" && {
        details: error.message,
        code: error.code ?? null,
      }),
    });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found. Complete your profile first.",
      });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    console.error("Profile lookup error:", error);

    return res.status(500).json({
      message: "Could not retrieve profile",
    });
  }
};
