import { BrainCircuit, Sparkles, ArrowRight } from "lucide-react";

export default function AIMock() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl">
      {/* Glow */}
      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="relative p-7">
        {/* Header */}

        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
            <BrainCircuit className="h-6 w-6 text-violet-500" />
          </div>

          <div>
            <h3 className="font-semibold">AI Workspace</h3>

            <p className="text-sm text-muted-foreground">
              Smart productivity assistant
            </p>
          </div>
        </div>

        {/* Prompt */}

        <div className="mt-7 rounded-2xl border border-border/60 bg-muted/30 p-4">
          <div className="text-sm text-muted-foreground">
            Ask AI anything...
          </div>
        </div>

        {/* Summary */}

        <div className="mt-7 rounded-2xl border border-border/60 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />

            <h4 className="font-semibold">Today's Summary</h4>
          </div>

          <ul className="space-y-3 text-sm">
            <li>✔ Landing Page completed</li>

            <li>✔ Dashboard Preview finished</li>

            <li>✔ Features section added</li>

            <li>• Pricing section remaining</li>
          </ul>
        </div>

        {/* Suggestions */}

        <div className="mt-7">
          <h4 className="mb-4 font-semibold">Suggested Actions</h4>

          <div className="space-y-3">
            <Suggestion text="Generate Sprint Report" />

            <Suggestion text="Create Project Tasks" />

            <Suggestion text="Summarize Meeting" />

            <Suggestion text="Optimize Landing Page" />
          </div>
        </div>

        {/* Bottom */}

        <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-500 py-4 font-medium text-white transition hover:bg-violet-600">
          Generate Tasks
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <button className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm transition hover:border-violet-400 hover:bg-muted/40">
      {text}

      <ArrowRight className="h-4 w-4 opacity-50" />
    </button>
  );
}
