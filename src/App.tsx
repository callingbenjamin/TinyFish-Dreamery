import { useState, useRef } from "react";
import { SearchForm } from "./components/SearchForm";
import { ResultsPanel } from "./components/ResultsPanel";
import { SummaryPanel } from "./components/SummaryPanel";
import { AgentLog } from "./components/AgentLog";
import { findDeals } from "./api";
import type { SearchFilters, DealFinderResponse } from "./types";

const AGENT_STEPS = [
  { delay: 0, msg: "[SYSTEM] Initializing TinyFish session..." },
  { delay: 800, msg: "[AGENT] Navigating to Realtor.com..." },
  { delay: 2000, msg: "[AGENT] Entering search: {city}, {state}" },
  { delay: 3200, msg: "[AGENT] Applying filters — max ${maxPrice}, {minBeds}+ beds" },
  { delay: 4500, msg: "[AGENT] Page loaded. Scanning search results..." },
  { delay: 5800, msg: "[AGENT] Extracting listing details from result cards..." },
  { delay: 7200, msg: "[AGENT] Checking for price reduction badges..." },
  { delay: 8500, msg: "[AGENT] Reading days-on-market indicators..." },
  { delay: 10000, msg: "[AGENT] Clicking into top listings for detail extraction..." },
  { delay: 11500, msg: "[AGENT] Normalizing extracted data to JSON..." },
];

function interpolateStep(msg: string, filters: SearchFilters): string {
  return msg
    .replace("{city}", filters.city)
    .replace("{state}", filters.state)
    .replace("{maxPrice}", filters.maxPrice.toLocaleString())
    .replace("{minBeds}", String(filters.minBeds));
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DealFinderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  async function handleSearch(filters: SearchFilters) {
    setLoading(true);
    setError(null);
    setResults(null);
    setLogs([]);

    // Stream agent log steps while the API call runs
    timersRef.current.forEach(clearTimeout);
    timersRef.current = AGENT_STEPS.map(({ delay, msg }) =>
      setTimeout(
        () => setLogs((prev) => [...prev, interpolateStep(msg, filters)]),
        delay
      )
    );

    try {
      const data = await findDeals(filters);
      // Final success logs
      setLogs((prev) => [
        ...prev,
        `[SUCCESS] Extracted ${data.listings.length} properties.`,
        "[DREAMERY] Applying Opportunity Scoring...",
        `[DREAMERY] ${data.listings.filter((l) => l.label === "Strong lead").length} strong leads identified.`,
      ]);
      // Brief pause so the user sees the final logs before results appear
      await new Promise((r) => setTimeout(r, 800));
      setResults(data);
    } catch (e: any) {
      setLogs((prev) => [
        ...prev,
        `[ERROR] ${e.message || "Agent timed out or request failed."}`,
      ]);
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
      timersRef.current.forEach(clearTimeout);
    }
  }

  function handleReset() {
    setResults(null);
    setError(null);
    setLogs([]);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-dreamery-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-dreamery-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <span className="font-semibold text-gray-900">Dreamery</span>
          </div>
          {(results || error) && (
            <button
              onClick={handleReset}
              className="text-sm text-dreamery-600 hover:text-dreamery-700 font-medium"
            >
              New Search
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero / Search Section */}
        {!results && !loading && !error && (
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Deal Finder
            </h1>
            <p className="text-lg text-gray-500 mb-2">
              Find potentially overlooked real estate deals from live listing
              sites in minutes.
            </p>
            <p className="text-sm text-gray-400">
              An agent-powered workflow that searches listing sites, extracts
              opportunities, and highlights deals worth reviewing.
            </p>
          </div>
        )}

        {/* Search Form */}
        {!results && !loading && !error && (
          <SearchForm onSearch={handleSearch} />
        )}

        {/* Loading — Agent Log + Spinner */}
        {loading && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <div className="relative w-12 h-12 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-dreamery-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-dreamery-600 animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-gray-900">
                Agent is working...
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Navigating real websites and extracting structured data
              </p>
            </div>
            <AgentLog logs={logs} isSearching={loading} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto space-y-6">
            {logs.length > 0 && (
              <AgentLog logs={logs} isSearching={false} />
            )}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="text-red-700 font-medium mb-2">Search failed</p>
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-red-600 hover:text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            <SummaryPanel summary={results.summary} meta={results.meta} />
            <ResultsPanel listings={results.listings} />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20 py-6 text-center text-xs text-gray-400">
        Dreamery Deal Finder &middot; Powered by{" "}
        <span className="font-medium text-dreamery-500">TinyFish</span> Web
        Agent
        {results?.meta.source === "mock" && (
          <span className="ml-2 text-amber-500">(Mock Mode)</span>
        )}
      </footer>
    </div>
  );
}
