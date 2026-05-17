import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

const outfitInclude = {
  topItem: { include: { category: true } },
  middleItem: { include: { category: true } },
  bottomItem: { include: { category: true } },
  shoesItem: { include: { category: true } },
};

// Get user's outfits
router.get("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const outfits = await prisma.outfit.findMany({
      where: { userId: req.user!.id },
      include: outfitInclude,
      orderBy: { createdAt: "desc" },
    });
    res.json(outfits);
  } catch (error) {
    console.error("Error fetching outfits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create outfit
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name, topItemId, topColor, middleItemId, middleColor,
      bottomItemId, bottomColor, shoesItemId, shoesColor, previewData,
    } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const outfit = await prisma.outfit.create({
      data: {
        userId: req.user!.id,
        name,
        topItemId: topItemId || null,
        topColor: topColor || null,
        middleItemId: middleItemId || null,
        middleColor: middleColor || null,
        bottomItemId: bottomItemId || null,
        bottomColor: bottomColor || null,
        shoesItemId: shoesItemId || null,
        shoesColor: shoesColor || null,
        previewData: previewData || null,
      },
      include: outfitInclude,
    });
    res.status(201).json(outfit);
  } catch (error) {
    console.error("Error creating outfit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update outfit
router.put(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await prisma.outfit.findUnique({ where: { id } });

      if (!existing || existing.userId !== req.user!.id) {
        res.status(404).json({ error: "Outfit not found" });
        return;
      }

      const {
        name, topItemId, topColor, middleItemId, middleColor,
        bottomItemId, bottomColor, shoesItemId, shoesColor,
      } = req.body;

      const outfit = await prisma.outfit.update({
        where: { id },
        data: {
          name: name ?? existing.name,
          topItemId: topItemId !== undefined ? (topItemId || null) : existing.topItemId,
          topColor: topColor !== undefined ? (topColor || null) : existing.topColor,
          middleItemId: middleItemId !== undefined ? (middleItemId || null) : existing.middleItemId,
          middleColor: middleColor !== undefined ? (middleColor || null) : existing.middleColor,
          bottomItemId: bottomItemId !== undefined ? (bottomItemId || null) : existing.bottomItemId,
          bottomColor: bottomColor !== undefined ? (bottomColor || null) : existing.bottomColor,
          shoesItemId: shoesItemId !== undefined ? (shoesItemId || null) : existing.shoesItemId,
          shoesColor: shoesColor !== undefined ? (shoesColor || null) : existing.shoesColor,
          updatedAt: new Date(),
        },
        include: outfitInclude,
      });
      res.json(outfit);
    } catch (error) {
      console.error("Error updating outfit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete outfit
router.delete(
  "/:id",
  authenticateToken,
  async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const outfit = await prisma.outfit.findUnique({ where: { id } });

      if (!outfit || outfit.userId !== req.user!.id) {
        res.status(404).json({ error: "Outfit not found" });
        return;
      }

      await prisma.outfit.delete({ where: { id } });
      res.json({ message: "Outfit deleted" });
    } catch (error) {
      console.error("Error deleting outfit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
