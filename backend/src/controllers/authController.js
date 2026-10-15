
import supabase from "../config/supabase.js";
import prisma from "../config/database.js";

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Sign in using your existing Supabase client
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
        console.error("Supabase sign-in error:", error.message);

        return res.status(401).json({
            message: error.message,
        });
        }

        if (!data.session || !data.user) {
        console.error("Supabase returned no session or user");

        return res.status(401).json({
            message: "Sign-in did not return a valid session",
        });
    }

    // Find the corresponding library profile
    const profile = await prisma.profile.findUnique({
      where: { id: data.user.id },
    });

    return res.status(200).json({
    message: "Sign-in successful",

    nextStep: profile
        ? "DASHBOARD"
        : "COMPLETE_PROFILE",

    session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
    },

    user: {
        id: data.user.id,
        email: data.user.email,
    },

    profile: profile
        ? {
            fullName: profile.fullName,
            role: profile.role,
            requestedRole: profile.requestedRole,
            approvalStatus: profile.approvalStatus,
        }
        : null,
    });
  } catch (error) {
    console.error("Sign-in error:", error);

    return res.status(500).json({
      message: "An error occurred during sign-in",
    });
  }
};


export const getNextStep = async (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Missing access token",
      })
    }

    const token = authHeader.slice(7)

    // Verify the Supabase access token
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({
        message: "Invalid or expired access token",
      })
    }

    // Find the corresponding library profile
    const profile = await prisma.profile.findUnique({
      where: { id: data.user.id },
    })

    if (!profile) {
      return res.status(200).json({
        nextStep: 'COMPLETE_PROFILE',
      })
    }

    if (profile.approvalStatus === 'PENDING') {
      return res.status(200).json({
        nextStep: 'PENDING_APPROVAL',
      })
    }

    if (profile.approvalStatus === 'REJECTED') {
      return res.status(200).json({
        nextStep: 'PROFILE_REJECTED',
      })
    }

    if (
      profile.approvalStatus === 'APPROVED' &&
      profile.role !== 'PENDING'
    ) {
      return res.status(200).json({
        nextStep: 'DASHBOARD',
      })
    }
  } catch (error) {
    console.error("Get next step error:", error)

    return res.status(500).json({
      message: "Unable to determine next step",
    })
  }
}


export const registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate required fields
    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return res.status(400).json({
        message: "Email, password, and confirmation password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || normalizedEmail.length > 254) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Create the account through Supabase Auth.
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL}/verify-email`,
      },
    });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(201).json({
      message:
        "Registration received. Please check your email to verify your account.",
      requiresEmailVerification: true,
      // Do not expose passwords or session tokens.
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "An unexpected error occurred during registration.",
    });
  }
};


