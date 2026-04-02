/**
 * TinyFish Web Agent integration.
 *
 * Uses the TinyFish SSE endpoint to launch a browser agent that navigates
 * real websites, interacts with UI elements, and extracts structured data.
 *
 * Docs: https://docs.tinyfish.ai/api-reference/automation/run-browser-automation-with-sse-streaming
 */

interface SearchParams {
  city: string;
  state: string;
  maxPrice: number;
  minBeds: number;
  keyword?: string;
}

interface RawListing {
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

function buildGoal(params: SearchParams): string {
  const maxPriceStr = Number(params.maxPrice).toLocaleString();
  return `
Search for homes for sale in ${params.city}, ${params.state}.
Requirements: max price $${maxPriceStr}, at least ${params.minBeds} bedrooms.${params.keyword ? ` Keyword: "${params.keyword}".` : ""}

Extract the first 10 listings you find. For each listing, extract:
- address (string)
- price (number, e.g. 425000)
- beds (number)
- baths (number)
- sqft (number or null)
- url (string, the listing URL)
- daysOnMarket (number or null)
- priceReduction (number or null, dollar amount of any price cut)
- notes (string, brief observation about the listing)

Look for price reduction badges, days on market, and any interesting tags.

Return ONLY a JSON array. No markdown fences, no explanation text. Just the raw JSON array.
`.trim();
}

// Parse price strings like "$425,000" or "425000" to a number
function parsePrice(val: any): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const cleaned = val.replace(/[$,\s]/g, "");
    const num = Number(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

// Normalize a raw listing object from the agent into our expected shape
function normalizeListing(raw: any): RawListing {
  return {
    address: String(raw.address || raw.Address || "Unknown"),
    price: parsePrice(raw.price || raw.Price),
    beds: Number(raw.beds || raw.Beds || raw.bedrooms || 0),
    baths: Number(raw.baths || raw.Baths || raw.bathrooms || 0),
    sqft: raw.sqft || raw.Sqft || raw.square_feet || null,
    url: String(raw.url || raw.URL || raw.link || "#"),
    daysOnMarket: raw.daysOnMarket ?? raw.days_on_market ?? raw.DOM ?? null,
    priceReduction: raw.priceReduction != null
      ? parsePrice(raw.priceReduction)
      : raw.price_reduction != null
      ? parsePrice(raw.price_reduction)
      : null,
    notes: String(raw.notes || raw.Notes || raw.description || ""),
  };
}

export async function searchWithTinyFish(
  params: SearchParams
): Promise<RawListing[]> {
  const apiKey = process.env.TINYFISH_API_KEY;
  const apiUrl =
    process.env.TINYFISH_API_URL ||
    "https://agent.tinyfish.ai/v1/automation/run-sse";

  if (!apiKey) {
    throw new Error("TINYFISH_API_KEY is not set");
  }

  const goal = buildGoal(params);
  const startUrl = `https://www.zillow.com/homes/for_sale/${params.city.replace(/\s+/g, "-")}-${params.state}/`;

  console.log("[TinyFish] Starting agent...");
  console.log("[TinyFish] URL:", startUrl);

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      url: startUrl,
      goal,
      browser_profile: "stealth",
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TinyFish API error ${response.status}: ${body}`);
  }

  // Parse SSE stream
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let result: string | null = null;
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Process complete lines from buffer
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // Keep incomplete line in buffer

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      try {
        const event = JSON.parse(line.slice(6));

        if (event.type === "PROGRESS") {
          console.log(`[TinyFish] ${event.purpose || "working..."}`);
        }

        if (event.type === "COMPLETE") {
          if (event.status === "COMPLETED") {
            const raw = event.result?.result ?? event.result;
            if (raw) {
              result = typeof raw === "string" ? raw : JSON.stringify(raw);
            }
          }
          if (event.error) {
            throw new Error(`TinyFish agent failed: ${event.error}`);
          }
        }
      } catch (e: any) {
        if (e.message?.startsWith("TinyFish agent failed")) throw e;
      }
    }
  }

  if (!result) {
    throw new Error("TinyFish agent did not return a result");
  }

  console.log("[TinyFish] Raw result length:", result.length);

  // Extract JSON from the result — agent may wrap in markdown fences or prose
  let listings: RawListing[];
  try {
    // Try to find a JSON array in the output
    const jsonMatch = result.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      listings = (Array.isArray(parsed) ? parsed : [parsed]).map(normalizeListing);
    } else {
      // Try parsing the whole thing
      const parsed = JSON.parse(result);
      listings = (Array.isArray(parsed) ? parsed : [parsed]).map(normalizeListing);
    }
  } catch {
    console.error("[TinyFish] Failed to parse result:", result.slice(0, 500));
    throw new Error("Failed to parse TinyFish agent output as JSON");
  }

  // Filter out entries with no real data
  listings = listings.filter((l) => l.address !== "Unknown" && l.price > 0);

  console.log(`[TinyFish] Extracted ${listings.length} listings`);
  return listings;
}
