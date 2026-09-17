"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";

import { apiRequest } from "@/lib/api-client";

import type { ApiResponse } from "@/types/api";
import type { Room } from "@/types/room";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RoomGrid } from "@/components/dashboard/RoomGrid";
import { EmptyRooms } from "@/components/dashboard/EmptyRooms";
import { CreateRoomModal } from "@/components/dashboard/CreateRoomModal";
import { JoinRoomModal } from "@/components/dashboard/JoinRoomModal";
import { Navbar } from "@/components/common/navbar";

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

        // Wait for Clerk token
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

      /*
       * Backend returns the newly created room directly:
       *
       * {
       *   success: true,
       *   message: "Room created successfully.",
       *   data: {
       *     id: "...",
       *     ...
       *   }
       * }
       *
       * We only need the room ID for navigation.
       */
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

      /*
       * Reset modal state before navigation.
       */
      setRoomName("");
      setRoomDescription("");
      setRoomVisibility("PRIVATE");
      setCreateError(null);
      setShowCreateRoom(false);

      /*
       * Newly created room already contains the owner
       * as a room member on the backend.
       *
       * Enter the room directly.
       */
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

      /*
       * Backend joins the current user and returns
       * the joined room.
       */
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

      /*
       * Reset modal state before navigation.
       */
      setRoomCode("");
      setJoinError(null);
      setShowJoinRoom(false);

      /*
       * Enter the room immediately.
       */
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
              {/* Room skeleton header */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-32 animate-pulse rounded-md bg-muted" />
                  <div className="h-4 w-20 animate-pulse rounded-md bg-muted/70" />
                </div>
              </div>

              {/* Room cards */}
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
