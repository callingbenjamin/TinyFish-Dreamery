import type { DealFinderResponse } from "../types";

interface Props {
  summary: DealFinderResponse["summary"];
  meta: DealFinderResponse["meta"];
}

export function SummaryPanel({ summary, meta }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Agent Summary
        </span>
        {meta.source === "mock" && (
          <span className="ml-auto text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">
            Mock Mode
          </span>
        )}
        {meta.source === "tinyfish" && (
          <span className="ml-auto text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-200">
            Live via TinyFish
          </span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 mb-3">Top Opportunities</h3>
      <ul className="space-y-2 mb-5">
        {summary.topOpportunities.map((opp, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="text-dreamery-500 font-bold">{i + 1}.</span>
            {opp}
          </li>
        ))}
      </ul>

      <h3 className="font-semibold text-gray-900 mb-2">Why These Stand Out</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {summary.whyTheseStandOut}
      </p>

      <p className="text-xs text-gray-400 mt-4">
        Searched at {new Date(meta.searchedAt).toLocaleString()} &middot;{" "}
        {meta.totalFound} listings analyzed
      </p>
    </div>
  );
}
