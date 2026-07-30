export default function KanbanMock() {
  return (
    <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-xl">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-lg font-semibold">Sprint Board</h4>

        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Sprint 04
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Column
          title="Todo"
          color="bg-slate-500"
          tasks={["Landing Page", "Authentication", "REST API"]}
        />

        <Column
          title="Doing"
          color="bg-blue-500"
          tasks={["Dashboard", "Whiteboard", "AI Assistant"]}
        />

        <Column
          title="Done"
          color="bg-green-500"
          tasks={["Navbar", "Hero", "Footer"]}
        />
      </div>
    </div>
  );
}

function Column({
  title,
  color,
  tasks,
}: {
  title: string;
  color: string;
  tasks: string[];
}) {
  return (
    <div className="rounded-2xl bg-muted/30 p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />

        <span className="text-sm font-semibold">{title}</span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task}
            className="rounded-xl border border-border/60 bg-background px-3 py-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {task}
          </div>
        ))}
      </div>
    </div>
  );
}
