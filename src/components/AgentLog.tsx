export interface LogEntry {
  msg: string;
  time: string;
}

interface AgentLogProps {
  logs: LogEntry[];
  isSearching: boolean;
}

export function AgentLog({ logs, isSearching }: AgentLogProps) {
  return (
    <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 shadow-2xl font-mono text-xs">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-wider">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>TinyFish Web Agent Engine</span>
        </div>
        {isSearching && (
          <div className="flex items-center gap-2 text-blue-400 animate-pulse">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[10px] tracking-widest">LIVE</span>
          </div>
        )}
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[260px]">
        {logs.length === 0 ? (
          <p className="text-slate-600 italic">
            Agent standby. Awaiting parameters...
          </p>
        ) : (
          logs.map((entry, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-600 shrink-0">{entry.time}</span>
              <span
                className={
                  entry.msg.startsWith("[ERROR]")
                    ? "text-red-400"
                    : entry.msg.startsWith("[SUCCESS]") || entry.msg.startsWith("[DREAMERY]")
                    ? "text-emerald-300"
                    : entry.msg.startsWith("[SYSTEM]")
                    ? "text-slate-400"
                    : "text-emerald-500"
                }
              >
                {entry.msg}
              </span>
            </div>
          ))
        )}
        {isSearching && (
          <div className="h-4 w-2 bg-emerald-500 animate-pulse mt-1 inline-block rounded-sm" />
        )}
      </div>
    </div>
  );
}
