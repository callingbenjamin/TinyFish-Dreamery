/**
 * TinyFish Web Agent integration.
 *
 * This module wraps the TinyFish API, which launches a browser agent that
 * navigates real websites, interacts with UI elements, and extracts structured
 * data — no scraping or APIs, just real web interaction.
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

// --- TinyFish prompt template ---
// This is the instruction sent to the TinyFish Web Agent. It tells the agent
// exactly what multi-step workflow to perform on a live website.

function buildAgentPrompt(params: SearchParams): string {
  return `
You are a real estate research agent. Perform the following multi-step workflow:

STEP 1 — NAVIGATE
Go to https://www.realtor.com/realestateandhomes-search

STEP 2 — SEARCH
In the search bar, type "${params.city}, ${params.state}" and submit.

STEP 3 — APPLY FILTERS
- Set max price to ${params.maxPrice}
- Set minimum bedrooms to ${params.minBeds}
${params.keyword ? `- Search for keyword: "${params.keyword}"` : ""}
- Apply filters and wait for results to load

STEP 4 — EXTRACT LISTINGS
From the search results page, extract the first 15 listings. For each listing extract:
- address (full street address)
- price (number only, no formatting)
- beds (number)
- baths (number)
- sqft (number or null if not shown)
- url (full listing URL)
- daysOnMarket (number or null if not visible)
- priceReduction (dollar amount reduced or null if no reduction shown)
- notes (brief 1-sentence note about anything interesting: e.g. "new construction", "large lot", "price cut last week")

STEP 5 — LOOK FOR SIGNALS
While extracting, pay attention to:
- Any "Price Reduced" or "Price Cut" badges
- Days on market indicators
- Any "New Listing" or "Open House" tags
Include these observations in the notes field.

STEP 6 — RETURN JSON
Return ONLY a valid JSON array of objects with the fields above. No markdown, no explanation, just the JSON array.

Example output format:
[
  {
    "address": "123 Oak St, Austin, TX 78701",
    "price": 425000,
    "beds": 3,
    "baths": 2,
    "sqft": 1800,
    "url": "https://www.realtor.com/realestateandhomes-detail/123-Oak-St_Austin_TX_78701",
    "daysOnMarket": 45,
    "priceReduction": 15000,
    "notes": "Price reduced $15k last week. Large corner lot."
  }
]
`.trim();
}

export async function searchWithTinyFish(
  params: SearchParams
): Promise<RawListing[]> {
  const apiKey = process.env.TINYFISH_API_KEY;
  const apiUrl =
    process.env.TINYFISH_API_URL || "https://api.tinyfish.ai/v1/agent";

  if (!apiKey) {
    throw new Error("TINYFISH_API_KEY is not set");
  }

  const prompt = buildAgentPrompt(params);

  // Call TinyFish Web Agent API
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt,
      // TinyFish config — adjust these based on actual API docs
      config: {
        browser: true,
        timeout: 120000,
        returnFormat: "json",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`TinyFish API error ${response.status}: ${body}`);
  }

  const result = await response.json();

  // Parse the agent's response — TinyFish returns the agent output in a
  // result field. Adjust this path based on actual API response structure.
  const agentOutput = result.result || result.output || result.data;

  let listings: RawListing[];
  if (typeof agentOutput === "string") {
    // Agent returned JSON as a string — parse it
    const cleaned = agentOutput.replace(/```json?\n?/g, "").replace(/```/g, "");
    listings = JSON.parse(cleaned);
  } else if (Array.isArray(agentOutput)) {
    listings = agentOutput;
  } else {
    throw new Error("Unexpected TinyFish response format");
  }

  return listings;
}
