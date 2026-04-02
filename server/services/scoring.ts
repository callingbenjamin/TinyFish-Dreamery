interface Listing {
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number | null;
  url: string;
  daysOnMarket: number | null;
  priceReduction: number | null;
  notes: string;
}

interface ScoredListing extends Listing {
  opportunityScore: number;
  label: "Strong lead" | "Worth reviewing" | "Low priority";
  whyItStoodOut: string;
}

export function scoreListings(listings: Listing[]): ScoredListing[] {
  if (listings.length === 0) return [];

  const prices = listings.map((l) => l.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const priceRange = Math.max(...prices) - minPrice || 1;

  return listings
    .map((listing) => {
      let score = 50; // baseline
      const reasons: string[] = [];

      // Price reduction signal (up to +25)
      if (listing.priceReduction && listing.priceReduction > 0) {
        const reductionPct = listing.priceReduction / listing.price;
        score += Math.min(25, Math.round(reductionPct * 500));
        reasons.push(
          `Price reduced $${listing.priceReduction.toLocaleString()}`
        );
      }

      // Days on market signal (up to +20)
      if (listing.daysOnMarket !== null && listing.daysOnMarket > 21) {
        const domBonus = Math.min(20, Math.round((listing.daysOnMarket - 21) / 3));
        score += domBonus;
        reasons.push(`${listing.daysOnMarket} days on market — seller may be motivated`);
      }

      // Below-average price signal (up to +15)
      if (listing.price < avgPrice) {
        const priceDelta = (avgPrice - listing.price) / priceRange;
        score += Math.min(15, Math.round(priceDelta * 30));
        reasons.push("Priced below batch average");
      }

      // Interesting notes from agent
      if (listing.notes) {
        reasons.push(listing.notes);
      }

      score = Math.max(0, Math.min(100, score));

      const label: ScoredListing["label"] =
        score >= 75
          ? "Strong lead"
          : score >= 55
          ? "Worth reviewing"
          : "Low priority";

      return {
        ...listing,
        opportunityScore: score,
        label,
        whyItStoodOut: reasons.slice(0, 2).join(". ") || "Standard listing",
      };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function generateSummary(scored: ScoredListing[]) {
  const top3 = scored.slice(0, 3);

  const topOpportunities = top3.map(
    (l) =>
      `${l.address} at $${l.price.toLocaleString()} — ${l.whyItStoodOut}`
  );

  const strongCount = scored.filter((l) => l.label === "Strong lead").length;
  const reducedCount = scored.filter(
    (l) => l.priceReduction && l.priceReduction > 0
  ).length;
  const staleCount = scored.filter(
    (l) => l.daysOnMarket !== null && l.daysOnMarket > 30
  ).length;

  const parts: string[] = [];
  if (strongCount > 0) parts.push(`${strongCount} strong leads identified`);
  if (reducedCount > 0) parts.push(`${reducedCount} with recent price reductions`);
  if (staleCount > 0) parts.push(`${staleCount} sitting on market 30+ days`);

  const whyTheseStandOut =
    parts.length > 0
      ? `${parts.join(", ")}. These properties show signals of motivated sellers or below-market pricing relative to the batch — worth a closer look before they move.`
      : "These listings were extracted from live search results. Review them for fit with your investment criteria.";

  return { topOpportunities, whyTheseStandOut };
}
