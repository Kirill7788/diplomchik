import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all categories with items
router.get("/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.clothingCategory.findMany({
      include: {
        items: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { displayOrder: "asc" },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get items by zone
router.get("/items", async (req: Request, res: Response) => {
  try {
    const { zone } = req.query;
    const where: Record<string, unknown> = { isActive: true };

    if (zone) {
      where.category = { zone: zone as string };
    }

    const items = await prisma.clothingItem.findMany({
      where,
      include: { category: true },
      orderBy: { name: "asc" },
    });
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single item
router.get("/items/:id", async (req: Request, res: Response) => {
  try {
    const item = await prisma.clothingItem.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { category: true },
    });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
