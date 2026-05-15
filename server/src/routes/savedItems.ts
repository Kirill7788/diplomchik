import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Get user's saved items
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.savedItem.findMany({
      where: { userId: req.user!.id },
      include: {
        item: { include: { category: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (error) {
    console.error("Error fetching saved items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save an item with custom color
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { itemId, customColor, name } = req.body;

    if (!itemId || !customColor) {
      res.status(400).json({ error: "itemId and customColor are required" });
      return;
    }

    const savedItem = await prisma.savedItem.create({
      data: {
        userId: req.user!.id,
        itemId,
        customColor,
        name: name || null,
      },
      include: {
        item: { include: { category: true } },
      },
    });
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error saving item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete saved item
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await prisma.savedItem.findUnique({ where: { id } });

      if (!item || item.userId !== req.user!.id) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      await prisma.savedItem.delete({ where: { id } });
      res.json({ message: "Item deleted" });
    } catch (error) {
      console.error("Error deleting saved item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
