# Demo Script (2 minutes)

## Setup (before recording)

1. `npm install && npm run dev`
2. Open http://localhost:5173
3. Have the browser and terminal visible

## Script

### [0:00–0:15] Intro

> "This is Dreamery Deal Finder — a real estate workflow that uses TinyFish to search live listing sites and surface overlooked deals."

Show the landing page. Point out the subtitle and explanation text.

### [0:15–0:40] Search

> "I'll search for homes in Austin, Texas — max $500k, at least 3 beds."

- The form is pre-filled with Austin, TX defaults
- Click "Find Deals"
- Show the loading animation — call out each step:
  > "The TinyFish agent is navigating a real listing site, entering search filters, scrolling through results, and extracting structured data — all from live web pages."

### [0:40–1:15] Results

> "The agent found 12 listings. Dreamery then scored each one based on price reductions, days on market, and relative pricing."

- Point to the **Agent Summary** panel at the top
- Read the top 3 opportunities
- Show a **Strong lead** card — highlight the green badge, the price reduction, and the "why it stood out" text
- Show a **Low priority** card for contrast

### [1:15–1:40] Architecture

> "Under the hood, there's a multi-step prompt that tells the TinyFish agent exactly what workflow to perform on the live site — navigate, search, filter, extract, and return normalized JSON."

> "The scoring layer is pure business logic — no AI needed for that part. The agent does the hard part: interacting with dynamic websites that have no API."

### [1:40–2:00] Close

> "This is the first wedge of Dreamery — an AI-native real estate workflow platform. TinyFish makes it possible to build real web automation workflows that work on sites with no API, which is most of real estate."

> "The code is open on GitHub. Thanks for watching."
