import type { ScoredListing } from "../types";

const LABEL_STYLES = {
  "Strong lead": "bg-green-100 text-green-700 border-green-200",
  "Worth reviewing": "bg-amber-50 text-amber-700 border-amber-200",
  "Low priority": "bg-gray-100 text-gray-500 border-gray-200",
};

function formatPrice(n: number) {
  return "$" + n.toLocaleString();
}

export function PropertyCard({ listing }: { listing: ScoredListing }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Top row: label + score */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${LABEL_STYLES[listing.label]}`}
        >
          {listing.label}
        </span>
        <span className="text-xs text-gray-400">
          Score: <span className="font-semibold text-gray-600">{listing.opportunityScore}</span>/100
        </span>
      </div>

      {/* Price */}
      <p className="text-2xl font-bold text-gray-900 mb-1">
        {formatPrice(listing.price)}
        {listing.priceReduction && listing.priceReduction > 0 && (
          <span className="ml-2 text-sm font-medium text-green-600">
            -{formatPrice(listing.priceReduction)}
          </span>
        )}
      </p>

      {/* Address */}
      <p className="text-sm text-gray-600 mb-3">{listing.address}</p>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <span>{listing.beds} bd</span>
        <span>{listing.baths} ba</span>
        {listing.sqft && <span>{listing.sqft.toLocaleString()} sqft</span>}
        {listing.daysOnMarket !== null && (
          <span
            className={
              listing.daysOnMarket > 30 ? "text-amber-600 font-medium" : ""
            }
          >
            {listing.daysOnMarket}d on market
          </span>
        )}
      </div>

      {/* Why it stood out */}
      <p className="text-sm text-gray-500 italic mb-4">
        "{listing.whyItStoodOut}"
      </p>

      {/* Link */}
      <a
        href={listing.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-dreamery-600 hover:text-dreamery-700 font-medium"
      >
        View listing &rarr;
      </a>
    </div>
  );
}
