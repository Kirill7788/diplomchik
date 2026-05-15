import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  authenticateToken,
  requireAdmin,
  AuthRequest,
} from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// --- Categories ---

// Get all categories (admin)
router.get(
  "/categories",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res: Response) => {
    try {
      const categories = await prisma.clothingCategory.findMany({
        include: { items: true },
        orderBy: { displayOrder: "asc" },
      });
      res.json(categories);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Create category
router.post(
  "/categories",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, zone, displayOrder } = req.body;
      const category = await prisma.clothingCategory.create({
        data: { name, zone, displayOrder: displayOrder || 0 },
      });
      res.status(201).json(category);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete category
router.delete(
  "/categories/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.clothingCategory.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json({ message: "Category deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- Items ---

// Get all items (admin, including inactive)
router.get(
  "/items",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res: Response) => {
    try {
      const items = await prisma.clothingItem.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      res.json(items);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Create item
router.post(
  "/items",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, categoryId, svgTemplate, defaultColor, isActive } =
        req.body;
      const item = await prisma.clothingItem.create({
        data: {
          name,
          categoryId,
          svgTemplate,
          defaultColor: defaultColor || "#CCCCCC",
          isActive: isActive !== undefined ? isActive : true,
        },
        include: { category: true },
      });
      res.status(201).json(item);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update item
router.put(
  "/items/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      const { name, categoryId, svgTemplate, defaultColor, isActive } =
        req.body;
      const updateData: Record<string, unknown> = {};
      if (name !== undefined) updateData.name = name;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (svgTemplate !== undefined) updateData.svgTemplate = svgTemplate;
      if (defaultColor !== undefined) updateData.defaultColor = defaultColor;
      if (isActive !== undefined) updateData.isActive = isActive;

      const item = await prisma.clothingItem.update({
        where: { id: parseInt(req.params.id) },
        data: updateData,
        include: { category: true },
      });
      res.json(item);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete item
router.delete(
  "/items/:id",
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res: Response) => {
    try {
      await prisma.clothingItem.delete({
        where: { id: parseInt(req.params.id) },
      });
      res.json({ message: "Item deleted" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- Users ---
router.get(
  "/users",
  authenticateToken,
  requireAdmin,
  async (_req: AuthRequest, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          isAdmin: true,
          createdAt: true,
          _count: { select: { outfits: true, savedItems: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      res.json(users);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
