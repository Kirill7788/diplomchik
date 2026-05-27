import express from "express";
import cors from "cors";
import path from "path";
import { execSync } from "child_process";
import authRouter from "./routes/auth";
import clothingRouter from "./routes/clothing";
import outfitRouter from "./routes/outfits";
import savedItemsRouter from "./routes/savedItems";
import adminRouter from "./routes/admin";
import contactRouter from "./routes/contact";
import { seed } from "./seed";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// API routes
app.use("/api/auth", authRouter);
app.use("/api/clothing", clothingRouter);
app.use("/api/outfits", outfitRouter);
app.use("/api/saved-items", savedItemsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/contact", contactRouter);

// Serve static frontend in production
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

async function start() {
  try {
    console.log("Initializing database...");
    execSync("npx prisma generate && npx prisma db push", {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
    });
  } catch (e) {
    console.error("DB init error:", e);
  }

  await seed();

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();

export default app;
