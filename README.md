# Dreamery Deal Finder

An agent-powered real estate workflow that uses the [TinyFish Web Agent API](https://tinyfish.ai) to search live listing sites, extract structured data, and highlight deals worth reviewing.

Built for the **TinyFish Accelerator** application.

## What it does

1. User enters search criteria (city, state, max price, beds, optional keyword)
2. The backend sends a multi-step prompt to the TinyFish Web Agent
3. The agent navigates Realtor.com, applies filters, and extracts listing data from live pages
4. Dreamery scores each listing based on price reductions, days on market, and relative pricing
5. Results are displayed with opportunity labels, scores, and a summary of top deals

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/YOUR_USERNAME/TinyFish-Dreamery.git
cd TinyFish-Dreamery
npm install

# 2. Set up env (optional — app works without it in mock mode)
cp .env.example .env
# Edit .env and add your TINYFISH_API_KEY

# 3. Run
npm run dev
```

App runs at **http://localhost:5173**

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `TINYFISH_API_KEY` | No | Your TinyFish API key. Leave blank for mock mode. |
| `TINYFISH_API_URL` | No | API endpoint. Defaults to `https://api.tinyfish.ai/v1/agent` |
| `PORT` | No | Backend port. Defaults to `3001` |

## Mock Mode vs Live Mode

- **No API key** → Mock mode. Returns realistic seed data for Austin, TX. The UI works fully, including scoring and summaries. Great for demoing the interface.
- **API key set** → Live mode. The TinyFish Web Agent navigates real listing sites, extracts live data, and returns it for scoring.

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express + TypeScript (tsx)
- **Agent:** TinyFish Web Agent API
- **No database required**

## Architecture

```
User → React UI → POST /api/find-deals → Express backend
                                            ├── TinyFish Web Agent (live)
                                            └── Mock data (fallback)
                                          → Scoring engine → Scored results
                                          → Summary generator → Top picks
```

## File Structure

```
server/
  index.ts              — Express server entry
  routes/deals.ts       — POST /api/find-deals endpoint
  services/tinyfish.ts  — TinyFish API wrapper + prompt template
  services/scoring.ts   — Opportunity scoring + summary generation
  mock/austin-listings.ts — Seed data for mock mode
src/
  App.tsx               — Main app shell
  api.ts                — Frontend API client
  types.ts              — Shared TypeScript types
  components/
    SearchForm.tsx      — Search input form
    LoadingState.tsx    — Animated agent workflow steps
    ResultsPanel.tsx    — Listing card grid
    PropertyCard.tsx    — Individual listing card
    SummaryPanel.tsx    — Agent summary + top picks
```

## How to Demo (2 minutes)

DEMO_SCRIPT.md for a step-by-step walkthrough.
