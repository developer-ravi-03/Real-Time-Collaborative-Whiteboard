"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

import { apiRequest } from "@/lib/api-client";
import { socket } from "@/lib/socket";
import { useSocketConnection } from "@/hooks/useSocketConnection";

import type { ApiResponse } from "@/types/api";
import type { Room } from "@/types/room";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { EmptyRooms } from "@/components/dashboard/EmptyRooms";
import { CreateRoomModal } from "@/components/dashboard/CreateRoomModal";
import { JoinRoomModal } from "@/components/dashboard/JoinRoomModal";
import { Navbar } from "@/components/common/navbar";

type MemberRemovedRealtimeEvent = {
  roomId: string;
  memberId: string;
  userId: string;
  kicked?: boolean;
  removedBy?: {
    id: string;
    displayName?: string | null;
  };
};

type RoomDeletedRealtimeEvent = {
  roomId: string;
  deletedBy?: {
    id: string;
    displayName?: string | null;
  };
};

export default function DashboardClient() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const router = useRouter();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  const [roomCode, setRoomCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [roomVisibility, setRoomVisibility] = useState<"PUBLIC" | "PRIVATE">(
    "PRIVATE",
  );

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [realtimeNotification, setRealtimeNotification] = useState<
    string | null
  >(null);

  /*
   * ==========================================================
   * DASHBOARD SOCKET CONNECTION
   * ==========================================================
   *
   * Dashboard users are not inside a room socket namespace/room.
   *
   * We still need an authenticated Socket.IO connection so the
   * backend can directly notify this user's socket when:
   *
   *   - a room is deleted
   *   - the user is kicked from a room
   */
  const shouldConnectRealtime = isLoaded && Boolean(isSignedIn);

  useSocketConnection(shouldConnectRealtime);

  // =========================================================
  // AUTH + LOAD ROOMS
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const initializeDashboard = async () => {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let token: string | null = null;

        for (let attempt = 0; attempt < 10; attempt++) {
          if (cancelled) {
            return;
          }

          token = await getToken({
            skipCache: true,
          });

          if (token) {
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        if (!token) {
          throw new Error("Authentication session could not be initialized.");
        }

        if (cancelled) {
          return;
        }

        const response = await apiRequest<ApiResponse<Room[]>>(
          getToken,
          "/rooms/my",
        );

        if (!cancelled) {
          setRooms(response.data);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to initialize dashboard:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load dashboard.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initializeDashboard();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken]);

  // =========================================================
  // REALTIME ROOM/MEMBER REMOVAL
  // =========================================================

  useEffect(() => {
    if (!shouldConnectRealtime) {
      return;
    }

    const handleMemberRemoved = (event: MemberRemovedRealtimeEvent) => {
      if (!event?.roomId) {
        return;
      }

      /*
       * We only care about the kicked-user notification here.
       *
       * Other members receive their room-level event through
       * useBoardRealtime.
       */
      if (!event.kicked) {
        return;
      }

      setRooms((currentRooms) =>
        currentRooms.filter((room) => room.id !== event.roomId),
      );

      setRealtimeNotification(
        "You were removed from a room. The room has been removed from your dashboard.",
      );
    };

    const handleRoomDeleted = (event: RoomDeletedRealtimeEvent) => {
      if (!event?.roomId) {
        return;
      }

      setRooms((currentRooms) =>
        currentRooms.filter((room) => room.id !== event.roomId),
      );

      setRealtimeNotification("A room you belonged to has been deleted.");
    };

    socket.on("member:removed", handleMemberRemoved);
    socket.on("room:deleted", handleRoomDeleted);

    return () => {
      socket.off("member:removed", handleMemberRemoved);
      socket.off("room:deleted", handleRoomDeleted);
    };
  }, [shouldConnectRealtime]);

  /*
   * Automatically hide dashboard realtime notification.
   */
  useEffect(() => {
    if (!realtimeNotification) {
      return;
    }

    const timer = window.setTimeout(() => {
      setRealtimeNotification(null);
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [realtimeNotification]);

  // =========================================================
  // CREATE ROOM
  // =========================================================

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setCreateError("Room name is required.");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      const response = await apiRequest<
        ApiResponse<{
          id: string;
        }>
      >(getToken, "/rooms", {
        method: "POST",
        body: JSON.stringify({
          name: roomName.trim(),
          description: roomDescription.trim() || undefined,
          visibility: roomVisibility,
        }),
      });

      const createdRoomId = response.data.id;

      setRoomName("");
      setRoomDescription("");
      setRoomVisibility("PRIVATE");
      setCreateError(null);
      setShowCreateRoom(false);

      router.push(`/room/${createdRoomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);

      setCreateError(
        error instanceof Error ? error.message : "Failed to create room.",
      );
    } finally {
      setCreating(false);
    }
  };

  // =========================================================
  // JOIN ROOM
  // =========================================================

  const handleJoinRoom = async () => {
    const code = roomCode.trim().toUpperCase();

    if (code.length !== 6) {
      setJoinError("Please enter a valid 6-character room code.");
      return;
    }

    try {
      setJoining(true);
      setJoinError(null);

      const response = await apiRequest<
        ApiResponse<{
          room: {
            id: string;
          };
          yourRole?: string;
        }>
      >(getToken, "/rooms/join", {
        method: "POST",
        body: JSON.stringify({
          roomCode: code,
        }),
      });

      const joinedRoomId = response.data.room.id;

      setRoomCode("");
      setJoinError(null);
      setShowJoinRoom(false);

      router.push(`/room/${joinedRoomId}`);
    } catch (error) {
      console.error("Failed to join room:", error);

      setJoinError(
        error instanceof Error ? error.message : "Unable to join room.",
      );
    } finally {
      setJoining(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      <Navbar />

      {realtimeNotification && (
        <div
          className="
            fixed
            right-5
            top-5
            z-[9999]
            w-[min(420px,calc(100vw-2rem))]
            rounded-xl
            border
            border-border
            bg-background/95
            px-4
            py-4
            shadow-2xl
            backdrop-blur-xl
          "
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-destructive/10
                text-destructive
              "
            >
              !
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">Room update</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {realtimeNotification}
              </p>
            </div>
          </div>
        </div>
      )}

      <main>
        <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <DashboardHeader
            firstName={user?.firstName ?? undefined}
            onCreateRoom={() => {
              setCreateError(null);
              setShowCreateRoom(true);
            }}
            onJoinRoom={() => {
              setRoomCode("");
              setJoinError(null);
              setShowJoinRoom(true);
            }}
          />

          {error && (
            <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-20 animate-pulse rounded-md bg-muted/70" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border bg-card p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="h-11 w-11 animate-pulse rounded-xl bg-muted" />

                      <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                    </div>

                    <div className="mt-6 h-6 w-36 animate-pulse rounded-md bg-muted" />

                    <div className="mt-3 h-4 w-52 animate-pulse rounded-md bg-muted/70" />

                    <div className="mt-6 border-t border-border pt-4">
                      <div className="h-4 w-28 animate-pulse rounded-md bg-muted/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <EmptyRooms
              onCreateRoom={() => {
                setCreateError(null);
                setShowCreateRoom(true);
              }}
              onJoinRoom={() => {
                setRoomCode("");
                setJoinError(null);
                setShowJoinRoom(true);
              }}
            />
          ) : (
            <RoomGrid rooms={rooms} />
          )}
        </section>
      </main>

      <CreateRoomModal
        open={showCreateRoom}
        name={roomName}
        description={roomDescription}
        visibility={roomVisibility}
        loading={creating}
        error={createError}
        onNameChange={setRoomName}
        onDescriptionChange={setRoomDescription}
        onVisibilityChange={setRoomVisibility}
        onClose={() => setShowCreateRoom(false)}
        onSubmit={handleCreateRoom}
      />

      <JoinRoomModal
        open={showJoinRoom}
        roomCode={roomCode}
        joining={joining}
        error={joinError}
        onRoomCodeChange={setRoomCode}
        onClose={() => setShowJoinRoom(false)}
        onSubmit={handleJoinRoom}
      />
    </>
  );
}
