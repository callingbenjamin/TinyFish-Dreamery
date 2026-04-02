import { useState } from "react";
import type { SearchFilters } from "../types";

interface Props {
  onSearch: (filters: SearchFilters) => void;
}

export function SearchForm({ onSearch }: Props) {
  const [city, setCity] = useState("Austin");
  const [state, setState] = useState("TX");
  const [maxPrice, setMaxPrice] = useState("500000");
  const [minBeds, setMinBeds] = useState("3");
  const [keyword, setKeyword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({
      city: city.trim(),
      state: state.trim(),
      maxPrice: Number(maxPrice),
      minBeds: Number(minBeds),
      keyword: keyword.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
    >
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            City
          </label>
          <input
            type="text"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dreamery-500 focus:border-transparent"
            placeholder="Austin"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            State
          </label>
          <input
            type="text"
            required
            maxLength={2}
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dreamery-500 focus:border-transparent"
            placeholder="TX"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Max Price
          </label>
          <input
            type="number"
            required
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dreamery-500 focus:border-transparent"
            placeholder="500000"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">
            Min Beds
          </label>
          <input
            type="number"
            required
            min={1}
            value={minBeds}
            onChange={(e) => setMinBeds(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dreamery-500 focus:border-transparent"
            placeholder="3"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Keyword (optional)
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-dreamery-500 focus:border-transparent"
          placeholder='e.g. "pool", "fixer upper", "garage"'
        />
      </div>

      <button
        type="submit"
        className="w-full bg-dreamery-600 hover:bg-dreamery-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
      >
        Find Deals
      </button>

      <p className="text-xs text-gray-400 text-center mt-4">
        Uses TinyFish Web Agent to search live listing sites and extract
        opportunities.
      </p>
    </form>
  );
}
