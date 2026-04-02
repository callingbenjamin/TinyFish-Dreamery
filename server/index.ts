import "dotenv/config";
import express from "express";
import cors from "cors";
import { dealsRouter } from "./routes/deals.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", dealsRouter);

app.listen(PORT, () => {
  const mode = process.env.TINYFISH_API_KEY ? "LIVE (TinyFish)" : "MOCK";
  console.log(`[Dreamery] Server running on :${PORT} — mode: ${mode}`);
});
