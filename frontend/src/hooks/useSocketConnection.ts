"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

import { socket } from "@/lib/socket";

type SocketConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export function useSocketConnection(enabled = true) {
  const { getToken } = useAuth();

  const [status, setStatus] =
    useState<Exclude<SocketConnectionStatus, "connecting">>("disconnected");

  useEffect(() => {
    if (!enabled) {
      socket.disconnect();
      return;
    }

    let cancelled = false;

    socket.auth = (callback) => {
      void getToken({ skipCache: true })
        .then((token) => {
          callback({
            token: cancelled ? null : (token ?? null),
          });
        })
        .catch((error) => {
          console.error("Failed to get Clerk token for socket:", error);

          callback({
            token: null,
          });
        });
    };

    const handleConnect = () => {
      if (cancelled) return;

      setStatus("connected");

      console.info("[Socket] Connected:", socket.id);
    };

    const handleDisconnect = (reason: string) => {
      if (cancelled) return;

      setStatus("disconnected");

      console.info("[Socket] Disconnected:", reason);
    };

    const handleConnectError = (error: Error) => {
      if (cancelled) return;

      setStatus("error");

      console.error("[Socket] Connection error:", error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      cancelled = true;

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);

      socket.disconnect();
    };
  }, [enabled, getToken]);

  const effectiveStatus: SocketConnectionStatus = !enabled
    ? "disconnected"
    : socket.connected
      ? "connected"
      : status === "error"
        ? "error"
        : "connecting";

  return {
    socket,
    status: effectiveStatus,
    isConnected: effectiveStatus === "connected",
  };
}
