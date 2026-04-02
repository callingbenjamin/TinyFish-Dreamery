import { useState } from "react";
import { SearchForm } from "./components/SearchForm";
import { ResultsPanel } from "./components/ResultsPanel";
import { SummaryPanel } from "./components/SummaryPanel";
import { LoadingState } from "./components/LoadingState";
import { findDeals } from "./api";
import type { SearchFilters, DealFinderResponse } from "./types";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DealFinderResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(filters: SearchFilters) {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await findDeals(filters);
      setResults(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResults(null);
    setError(null);
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
          {results && (
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
        {!results && !loading && (
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
        {!results && !loading && (
          <SearchForm onSearch={handleSearch} />
        )}

        {/* Loading */}
        {loading && <LoadingState />}

        {/* Error */}
        {error && (
          <div className="max-w-xl mx-auto">
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
