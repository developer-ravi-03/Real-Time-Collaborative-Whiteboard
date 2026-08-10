import type { Room } from "@/types/room";
import { RoomCard } from "./RoomCard";

export function RoomGrid({ rooms }: { rooms: Room[] }) {
  return (
    <>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Your Rooms</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  );
}
