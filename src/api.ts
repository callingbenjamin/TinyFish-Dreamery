import type { SearchFilters, DealFinderResponse } from "./types";

export async function findDeals(
  filters: SearchFilters
): Promise<DealFinderResponse> {
  const res = await fetch("/api/find-deals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `Server error ${res.status}`);
  }
  return res.json();
}
