export default function AnalyticsMini() {
  const progress = [
    {
      label: "Completed",
      value: 82,
    },
    {
      label: "Team",
      value: 65,
    },
    {
      label: "Sprint",
      value: 91,
    },
  ];

  return (
    <div className="space-y-5">
      {progress.map((item) => (
        <div key={item.label}>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>{item.label}</span>
            <span>{item.value}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${item.value}%`,
              }}
            />
          </div>
        </div>
      ))}

      <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground">AI Productivity Score</p>

        <h2 className="mt-2 text-3xl font-bold">
          94<span className="text-primary">%</span>
        </h2>
      </div>
    </div>
  );
}
