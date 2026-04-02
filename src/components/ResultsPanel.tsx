import { PropertyCard } from "./PropertyCard";
import type { ScoredListing } from "../types";

export function ResultsPanel({ listings }: { listings: ScoredListing[] }) {
  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        {listings.length} Listings Found
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Sorted by opportunity score, highest first.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((l, i) => (
          <PropertyCard key={i} listing={l} />
        ))}
      </div>
    </div>
  );
}
