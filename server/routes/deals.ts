import { Router } from "express";
import { searchWithTinyFish } from "../services/tinyfish.js";
import { scoreListings, generateSummary } from "../services/scoring.js";

export const dealsRouter = Router();

dealsRouter.post("/find-deals", async (req, res) => {
  try {
    const { city, state, maxPrice, minBeds, keyword } = req.body;

    if (!city || !state || !maxPrice || !minBeds) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const rawListings = await searchWithTinyFish({
      city,
      state,
      maxPrice,
      minBeds,
      keyword,
    });

    const scored = scoreListings(rawListings);
    const summary = generateSummary(scored);

    res.json({
      listings: scored,
      summary,
      meta: {
        source: "tinyfish",
        searchedAt: new Date().toISOString(),
        totalFound: scored.length,
      },
    });
  } catch (err: any) {
    console.error("[find-deals] Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});
