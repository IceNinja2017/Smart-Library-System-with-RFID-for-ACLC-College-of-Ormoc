
import supabase from "../config/supabase.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Please sign in first.",
      });
    }

    const token = header.slice(7);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        message: "Invalid or expired session.",
      });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
}
