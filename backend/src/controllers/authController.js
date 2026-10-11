
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


export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "A valid email and password of at least 8 characters are required",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(201).json({
      message: data.session
        ? "Registration successful. You can now sign in."
        : "Registration successful. Please check your email to confirm your account.",
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      requiresEmailConfirmation: !data.session,
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Registration failed. Please try again later.",
    });
  }
};


