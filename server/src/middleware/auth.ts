import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "outfit-constructor-secret-2024";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
  };
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: number;
      username: string;
    };
    prisma.user
      .findUnique({ where: { id: decoded.sub } })
      .then((user) => {
        if (!user) {
          res.status(401).json({ error: "User not found" });
          return;
        }
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        next();
      })
      .catch(() => {
        res.status(500).json({ error: "Internal server error" });
      });
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: number;
      username: string;
    };
    prisma.user
      .findUnique({ where: { id: decoded.sub } })
      .then((user) => {
        if (user) {
          req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
          };
        }
        next();
      })
      .catch(() => next());
  } catch {
    next();
  }
}

export { JWT_SECRET };
