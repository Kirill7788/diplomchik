import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Submit contact message
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    const contactMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    res.status(201).json({
      message: "Message sent successfully",
      id: contactMessage.id,
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
