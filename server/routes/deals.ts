import { Router } from "express";
import { searchWithTinyFish } from "../services/tinyfish.js";
import { scoreListings, generateSummary } from "../services/scoring.js";
import { getMockListings } from "../mock/austin-listings.js";

export const dealsRouter = Router();

dealsRouter.post("/find-deals", async (req, res) => {
  try {
    const { city, state, maxPrice, minBeds, keyword } = req.body;

    if (!city || !state || !maxPrice || !minBeds) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const hasKey = !!process.env.TINYFISH_API_KEY;
    let rawListings;
    let source: "tinyfish" | "mock" = "mock";

    if (hasKey) {
      try {
        rawListings = await searchWithTinyFish({
          city,
          state,
          maxPrice,
          minBeds,
          keyword,
        });
        source = "tinyfish";
      } catch (err: any) {
        console.warn("[find-deals] TinyFish failed, falling back to mock:", err.message);
        // Fall back to mock on any TinyFish error
        rawListings = null;
      }
    }

    if (!rawListings) {
      // Mock mode — simulate agent delay for demo
      await new Promise((r) => setTimeout(r, 15000));
      rawListings = getMockListings({ city, state, maxPrice, minBeds, keyword });
      source = "mock";
    }

    const scored = scoreListings(rawListings);
    const summary = generateSummary(scored);

    res.json({
      listings: scored,
      summary,
      meta: {
        source,
        searchedAt: new Date().toISOString(),
        totalFound: scored.length,
      },
    });
  } catch (err: any) {
    console.error("[find-deals] Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});
