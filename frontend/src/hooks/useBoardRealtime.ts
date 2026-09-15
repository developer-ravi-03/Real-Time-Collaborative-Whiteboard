"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { socket } from "@/lib/socket";
import { useSocketConnection } from "@/hooks/useSocketConnection";

type RealtimeStatus =
  | "connecting"
  | "connected"
  | "joined"
  | "error"
  | "disconnected";

type RoomJoinResponse = {
  success: boolean;
  message: string;
  users?: Array<{
    userId: string;
    displayName: string | null;
    imageUrl: string | null;
  }>;
};

type RoomLeaveResponse = {
  success: boolean;
  message: string;
};

export function useBoardRealtime(roomId: string | null) {
  const { isLoaded, isSignedIn } = useAuth();

  const [status, setStatus] = useState<RealtimeStatus>("disconnected");

  const [roomError, setRoomError] = useState<string | null>(null);

  const [roomUsers, setRoomUsers] = useState<RoomJoinResponse["users"]>([]);

  const { isConnected, status: socketStatus } = useSocketConnection(
    isLoaded && isSignedIn && Boolean(roomId),
  );

  useEffect(() => {
    if (!roomId || !isLoaded || !isSignedIn) {
      return;
    }

    let cancelled = false;
    let joined = false;

    setRoomError(null);
    setRoomUsers([]);

    const joinRoom = () => {
      if (cancelled || !socket.connected) {
        return;
      }

      setStatus("connecting");

      socket.emit("room:join", { roomId }, (response: RoomJoinResponse) => {
        if (cancelled) {
          return;
        }

        if (!response?.success) {
          setStatus("error");
          setRoomError(response?.message || "Failed to join room.");

          return;
        }

        joined = true;

        setStatus("joined");
        setRoomError(null);
        setRoomUsers(response.users ?? []);

        console.info(`[Realtime] Joined room: ${roomId}`);
      });
    };

    const handleConnect = () => {
      joinRoom();
    };

    const handleConnectError = (error: Error) => {
      if (cancelled) {
        return;
      }

      setStatus("error");
      setRoomError(error.message);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("connect_error", handleConnectError);

    return () => {
      cancelled = true;

      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);

      if (joined && socket.connected) {
        socket.emit("room:leave", {}, (response: RoomLeaveResponse) => {
          if (!response?.success) {
            console.warn("[Realtime] Failed to leave room:", response?.message);
          } else {
            console.info(`[Realtime] Left room: ${roomId}`);
          }
        });
      }
    };
  }, [roomId, isLoaded, isSignedIn]);

  useEffect(() => {
    if (!roomId) {
      setStatus("disconnected");
      return;
    }

    if (socketStatus === "error") {
      setStatus("error");
      return;
    }

    if (socketStatus === "connecting") {
      setStatus("connecting");
      return;
    }

    if (socketStatus === "disconnected") {
      setStatus("disconnected");
      return;
    }

    if (isConnected && status !== "joined") {
      setStatus("connected");
    }
  }, [roomId, socketStatus, isConnected, status]);

  return {
    status,
    roomError,
    roomUsers,
    isConnected,
    isJoined: status === "joined",
  };
}
