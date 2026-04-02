const STEPS = [
  "Launching TinyFish Web Agent...",
  "Navigating to listing site...",
  "Entering search filters...",
  "Scanning search results...",
  "Extracting listing details...",
  "Identifying price drops & stale listings...",
  "Scoring opportunities...",
];

import { useState, useEffect } from "react";

export function LoadingState() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s < STEPS.length - 1 ? s + 1 : s));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-md mx-auto text-center py-20">
      {/* Animated spinner */}
      <div className="relative w-16 h-16 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-dreamery-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-dreamery-600 animate-spin"></div>
      </div>

      <p className="text-lg font-medium text-gray-900 mb-6">
        Agent is working...
      </p>

      <div className="space-y-2">
        {STEPS.map((label, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 justify-center text-sm transition-all duration-500 ${
              i < step
                ? "text-dreamery-600"
                : i === step
                ? "text-gray-900 font-medium"
                : "text-gray-300"
            }`}
          >
            <span className="w-5 text-right">
              {i < step ? (
                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : i === step ? (
                <span className="inline-block w-2 h-2 bg-dreamery-600 rounded-full animate-pulse"></span>
              ) : (
                <span className="inline-block w-2 h-2 bg-gray-200 rounded-full"></span>
              )}
            </span>
            {label}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-8">
        The agent navigates real websites, interacts with search forms, and
        extracts structured data from live pages.
      </p>
    </div>
  );
}
