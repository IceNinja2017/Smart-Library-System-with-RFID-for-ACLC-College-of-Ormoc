import prisma from '../config/database.js';

export async function requireAdmin(req, res, next) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!profile || profile.role !== "ADMIN") {
      return res.status(403).json({
        message: "Admin access required",
      }); 
    }

    next();
  } catch (error) {
    next(error);
  }
}