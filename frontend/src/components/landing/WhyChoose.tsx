import {
  Bot,
  BrainCircuit,
  ShieldCheck,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";

import BentoCard from "./BentoCard";
import AnalyticsMini from "./features/visuals/AnalyticsMini";
// import AnalyticsMini from "./visuals/AnalyticsMini";

export default function WhyChoose() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            Why Choose SyncBoard
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            Everything your team needs.
            <br />
            All in one workspace.
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            Manage projects, collaborate in real time, automate repetitive
            tasks, and boost productivity with AI-powered workflows.
          </p>
        </div>

        <div className="grid auto-rows-[260px] gap-6 lg:grid-cols-3">
          <BentoCard
            className="lg:col-span-2"
            icon={<Bot size={26} />}
            title="AI Automation"
            description="Generate tasks, summarize meetings, and automate repetitive workflows with AI."
          >
            <div className="grid grid-cols-2 gap-3">
              {[
                "Generate Tasks",
                "Sprint Summary",
                "Meeting Notes",
                "AI Suggestions",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </BentoCard>

          <BentoCard
            icon={<BarChart3 size={26} />}
            title="Analytics"
            description="Understand team performance with smart AI insights."
          >
            <AnalyticsMini />
          </BentoCard>

          <BentoCard
            icon={<Users size={26} />}
            title="Real-Time Collaboration"
            description="Live cursors, instant updates, comments, and multiplayer editing."
          />

          <BentoCard
            icon={<ShieldCheck size={26} />}
            title="Enterprise Security"
            description="Protected routes, secure authentication, and role-based access."
          />

          <BentoCard
            icon={<BrainCircuit size={26} />}
            title="Smart Insights"
            description="AI identifies bottlenecks and recommends better workflows."
          />

          <BentoCard
            className="lg:col-span-3"
            icon={<Zap size={26} />}
            title="Built With Modern Tech"
            description="Powered by technologies developers already love."
          >
            <div className="mt-2 flex flex-wrap gap-3">
              {[
                "Next.js",
                "TypeScript",
                "Tailwind CSS",
                "Convex",
                "Clerk",
                "GetStream",
                "Framer Motion",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-muted/40 px-4 py-2 text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
