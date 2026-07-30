import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  CalendarDays,
  Sparkles,
  Settings,
  Search,
} from "lucide-react";

export default function DashboardPreview() {
  return (
    <section className="mt-10 w-full max-w-6xl">
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-2xl backdrop-blur-xl">
        {/* Browser Header */}
        <div className="flex items-center gap-2 border-b border-border/60 px-6 py-4">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />

          <div className="ml-5 rounded-full bg-muted px-4 py-1 text-xs text-muted-foreground">
            app.syncboard.dev
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="grid min-h-[620px] grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="flex flex-col justify-between border-r border-border/60 bg-muted/20 p-5">
            <div>
              {/* Workspace */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-foreground">SyncBoard</h3>

                <p className="text-sm text-muted-foreground">Team Workspace</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <SidebarItem
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  active
                />

                <SidebarItem
                  icon={<FolderKanban size={18} />}
                  label="Projects"
                />

                <SidebarItem icon={<CheckSquare size={18} />} label="Tasks" />

                <SidebarItem icon={<Users size={18} />} label="Team" />

                <SidebarItem
                  icon={<CalendarDays size={18} />}
                  label="Calendar"
                />

                <SidebarItem
                  icon={<Sparkles size={18} />}
                  label="AI Assistant"
                />
              </nav>
            </div>

            <SidebarItem icon={<Settings size={18} />} label="Settings" />
          </aside>

          {/* Main */}
          <main className="p-8">
            <div className="flex items-center justify-between border-b border-border/60 pb-6">
              <div>
                <h2 className="text-3xl font-bold">Welcome back</h2>

                <p className="mt-2 text-muted-foreground">
                  Manage your projects, tasks and AI collaboration from one
                  place.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Search */}

                <div className="flex h-11 w-60 items-center rounded-xl border border-border/60 bg-muted/40 px-4">
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />

                  <input
                    placeholder="Search..."
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>

                {/* New Project */}

                <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  + New Project
                </button>

                {/* Avatar */}

                <div className="flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-background bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                  R
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-5">
              <StatCard
                icon={<FolderKanban className="h-5 w-5" />}
                title="Projects"
                value="24"
                change="+12% this month"
              />

              <StatCard
                icon={<CheckSquare className="h-5 w-5" />}
                title="Tasks"
                value="132"
                change="18 due today"
              />

              <StatCard
                icon={<Users className="h-5 w-5" />}
                title="Team"
                value="12"
                change="+2 new members"
              />

              <StatCard
                icon={<Sparkles className="h-5 w-5" />}
                title="AI Score"
                value="98%"
                change="Excellent"
              />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-6">
              {/* Recent Tasks */}
              <div className="col-span-2 rounded-2xl border border-border/60 bg-background/50 p-6 backdrop-blur-xl">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Recent Tasks</h3>

                  <button className="text-sm text-primary hover:underline">
                    View all
                  </button>
                </div>

                <div className="space-y-4">
                  <TaskItem
                    title="Landing Page UI"
                    project="Website"
                    status="Done"
                  />

                  <TaskItem
                    title="Dashboard Preview"
                    project="Frontend"
                    status="In Progress"
                  />

                  <TaskItem
                    title="Authentication Flow"
                    project="Backend"
                    status="Review"
                  />

                  <TaskItem
                    title="Database Schema"
                    project="Database"
                    status="Pending"
                  />
                </div>
              </div>

              {/* AI Assistant */}
              <div className="rounded-2xl border border-border/60 bg-background/50 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-500" />

                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">
                  Smart suggestions to improve your productivity.
                </p>

                <div className="mt-6 space-y-3">
                  <Suggestion text="Summarize today's progress" />

                  <Suggestion text="Generate stand-up report" />

                  <Suggestion text="Review pending tasks" />

                  <Suggestion text="Optimize landing page UI" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-4
        py-3
        text-sm
        font-medium
        transition-all
        duration-200

        ${
          active
            ? "bg-primary text-primary-foreground shadow-md"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}
    >
      {icon}

      <span>{label}</span>
    </button>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-border/60
        bg-background/50
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-lg
      "
    >
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</div>

        <span className="text-xs text-green-500 font-medium">{change}</span>
      </div>

      <h4 className="mt-5 text-sm text-muted-foreground">{title}</h4>

      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function TaskItem({
  title,
  project,
  status,
}: {
  title: string;
  project: string;
  status: string;
}) {
  const color =
    status === "Done"
      ? "bg-green-500"
      : status === "In Progress"
        ? "bg-blue-500"
        : status === "Review"
          ? "bg-yellow-500"
          : "bg-red-500";

  return (
    <div className="flex items-center justify-between rounded-xl border border-border/40 px-4 py-3 transition hover:bg-muted/30">
      <div>
        <h4 className="font-medium">{title}</h4>

        <p className="text-sm text-muted-foreground">{project}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />

        <span className="text-sm">{status}</span>
      </div>
    </div>
  );
}

function Suggestion({ text }: { text: string }) {
  return (
    <button className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-left text-sm transition hover:border-primary/30 hover:bg-muted/60">
      {text}
    </button>
  );
}
