import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest, JWT_SECRET } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existing) {
      res.status(409).json({ error: "Username or email already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, hashedPassword },
    });

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      access_token: token,
      token_type: "bearer",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: "Username and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { sub: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      access_token: token,
      token_type: "bearer",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Request password reset
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      res.json({ message: "If an account with that email exists, a reset link has been generated" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExp = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp },
    });

    // In production, send email with the token. For now, return the token directly
    // so the frontend can use it for the reset flow.
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      message: "If an account with that email exists, a reset link has been generated",
      // In a dev environment, we return the token for testing
      resetToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset password with token
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and new password are required" });
      return;
    }

    if (newPassword.length < 4) {
      res.status(400).json({ error: "Password must be at least 4 characters" });
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gte: new Date() },
      },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid or expired reset token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get(
  "/me",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    res.json({ user: req.user });
  }
);

export default router;
