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

      // Price reduction signal (+20 flat — the "wedge")
      if (listing.priceReduction && listing.priceReduction > 0) {
        score += 20;
        reasons.push(
          `Price reduced $${listing.priceReduction.toLocaleString()}`
        );
      }

      // Stale listing tiers — motivated sellers (+15 / +25)
      if (listing.daysOnMarket !== null) {
        if (listing.daysOnMarket > 60) {
          score += 25;
          reasons.push(`${listing.daysOnMarket}d on market — likely motivated seller`);
        } else if (listing.daysOnMarket > 30) {
          score += 15;
          reasons.push(`${listing.daysOnMarket}d on market — seller may be motivated`);
        }
      }

      // Value density — price per sqft below $200 is a deal signal (+15)
      if (listing.sqft && listing.sqft > 0) {
        const pricePerSqft = listing.price / listing.sqft;
        if (pricePerSqft < 200) {
          score += 15;
          reasons.push(
            `$${Math.round(pricePerSqft)}/sqft — strong value density`
          );
        }
      }

      // Below-average price relative to batch (+10)
      if (listing.price < avgPrice) {
        const priceDelta = (avgPrice - listing.price) / priceRange;
        score += Math.min(10, Math.round(priceDelta * 20));
        reasons.push("Priced below batch average");
      }

      // Agent notes
      if (listing.notes) {
        reasons.push(listing.notes);
      }

      score = Math.max(0, Math.min(100, score));

      const label: ScoredListing["label"] =
        score >= 80
          ? "Strong lead"
          : score >= 60
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
