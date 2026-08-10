"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/common/navbar";

type Board = {
  id: string;
  name: string;
  description?: string | null;
  type: "INFINITE" | "SLIDES";
};

export default function DashboardPage() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    setBoards([
      {
        id: "demo-infinite",
        name: "Frontend Design",
        description: "Infinite whiteboard",
        type: "INFINITE",
      },
      {
        id: "demo-slides",
        name: "Backend Design",
        description: "Presentation board",
        type: "SLIDES",
      },
    ]);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Boards</h1>

          <p className="mt-2 text-muted-foreground">
            Select a board to start collaborating.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {boards.map((board) => (
            <button
              key={board.id}
              className="
                rounded-2xl
                border
                border-border
                bg-card
                p-6
                text-left
                transition-all
                hover:-translate-y-1
                hover:border-primary/40
                hover:shadow-lg
              "
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  {board.type === "SLIDES" ? "▤" : "✦"}
                </div>

                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {board.type}
                </span>
              </div>

              <h2 className="text-lg font-semibold">{board.name}</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {board.description}
              </p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
