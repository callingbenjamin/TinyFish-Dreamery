export interface SearchFilters {
  city: string;
  state: string;
  maxPrice: number;
  minBeds: number;
  keyword?: string;
}

export interface Listing {
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

export interface ScoredListing extends Listing {
  opportunityScore: number;
  label: "Strong lead" | "Worth reviewing" | "Low priority";
  whyItStoodOut: string;
}

export interface DealFinderResponse {
  listings: ScoredListing[];
  summary: {
    topOpportunities: string[];
    whyTheseStandOut: string;
  };
  meta: {
    source: "tinyfish";
    searchedAt: string;
    totalFound: number;
  };
}
