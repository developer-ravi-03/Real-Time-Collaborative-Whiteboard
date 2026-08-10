"use client";

import { useParams } from "next/navigation";

export default function RoomPage() {
  const params = useParams();

  const roomId = params.roomId as string;

  return (
    <main className="flex h-screen flex-col bg-neutral-100">
      <header className="flex h-14 items-center justify-between border-b bg-white px-5">
        <div>
          <h1 className="font-semibold">SyncBoard</h1>
          <p className="text-xs text-neutral-500">Room: {roomId}</p>
        </div>

        <button className="rounded-md bg-black px-4 py-2 text-sm text-white">
          Leave
        </button>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white p-4">
          <h2 className="mb-4 font-semibold">Boards</h2>

          <div className="space-y-2">
            <button className="w-full rounded-md bg-neutral-100 p-3 text-left">
              Frontend Design
            </button>

            <button className="w-full rounded-md p-3 text-left hover:bg-neutral-100">
              Backend Design
            </button>
          </div>
        </aside>

        <section className="relative flex-1 bg-neutral-200">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-lg border bg-white px-8 py-6 shadow">
              Canvas coming next...
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
