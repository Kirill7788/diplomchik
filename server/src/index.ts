import express from "express";
import cors from "cors";
import path from "path";
import authRouter from "./routes/auth";
import clothingRouter from "./routes/clothing";
import outfitRouter from "./routes/outfits";
import savedItemsRouter from "./routes/savedItems";
import adminRouter from "./routes/admin";

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

// Serve static frontend in production
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;
