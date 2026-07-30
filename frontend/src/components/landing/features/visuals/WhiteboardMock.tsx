export default function WhiteboardMock() {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl border border-border/60 bg-background shadow-xl">
      {/* Grid */}

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />

      {/* Sticky */}

      <div className="absolute left-10 top-10 rounded-xl bg-yellow-300 px-4 py-3 text-sm font-semibold text-black shadow-lg">
        Landing Page
      </div>

      <div className="absolute right-12 top-20 rounded-xl bg-cyan-300 px-4 py-3 text-sm font-semibold text-black shadow-lg">
        AI Ideas
      </div>

      <div className="absolute bottom-20 left-28 rounded-xl bg-pink-300 px-4 py-3 text-sm font-semibold text-black shadow-lg">
        Database
      </div>

      {/* Connection */}

      <div className="absolute left-44 top-24 h-[2px] w-44 bg-primary" />

      <div className="absolute left-[220px] top-24 h-24 w-[2px] bg-primary" />

      {/* Live Cursor */}

      <div className="absolute bottom-10 right-10 flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2">
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

        <span className="text-xs font-medium text-green-500">
          Ravi editing...
        </span>
      </div>
    </div>
  );
}
