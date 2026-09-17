"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@clerk/nextjs";

import { socket } from "@/lib/socket";
import { useSocketConnection } from "@/hooks/useSocketConnection";

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

export type RealtimeStatus =
  | "connecting"
  | "connected"
  | "joined"
  | "error"
  | "disconnected";

export type RoomUser = {
  userId: string;
  displayName: string | null;
  imageUrl: string | null;
};

type RoomJoinResponse = {
  success: boolean;
  message: string;
  users?: RoomUser[];
};

type RoomLeaveResponse = {
  success: boolean;
  message: string;
};

export type CanvasRealtimeUpdate = {
  pageId: string;
  canvasData: Record<string, unknown>;
  userId?: string;
};

type CanvasUpdateResponse = {
  success: boolean;
  message?: string;
};

type RoomErrorState = {
  roomId: string;
  message: string;
};

type RoomUsersState = {
  roomId: string;
  users: RoomUser[];
};

type RemoteCanvasState = {
  roomId: string;
  update: CanvasRealtimeUpdate;
};

/*
 * ==========================================================
 * HOOK
 * ==========================================================
 */

export function useBoardRealtime(roomId: string | null) {
  /*
   * ========================================================
   * AUTH
   * ========================================================
   */

  const { isLoaded, isSignedIn } = useAuth();

  /*
   * ========================================================
   * STATE
   * ========================================================
   */

  const [joinedRoomId, setJoinedRoomId] = useState<string | null>(null);

  const [roomErrorState, setRoomErrorState] = useState<RoomErrorState | null>(
    null,
  );

  const [roomUsersState, setRoomUsersState] = useState<RoomUsersState | null>(
    null,
  );

  const [remoteCanvasState, setRemoteCanvasState] =
    useState<RemoteCanvasState | null>(null);

  /*
   * ========================================================
   * JOINED ROOM REF
   * ========================================================
   *
   * IMPORTANT:
   *
   * Do NOT put joinedRoomId state into the main socket
   * lifecycle effect dependency array.
   *
   * The socket lifecycle should NOT restart every time
   * React state changes after a successful room join.
   */

  const joinedRoomIdRef = useRef<string | null>(null);

  /*
   * ========================================================
   * SOCKET CONNECTION
   * ========================================================
   */

  const shouldConnect = isLoaded && Boolean(isSignedIn) && Boolean(roomId);

  const { isConnected, status: socketStatus } =
    useSocketConnection(shouldConnect);

  /*
   * ========================================================
   * DERIVED VALUES
   * ========================================================
   */

  const isJoined = Boolean(roomId) && joinedRoomId === roomId;

  const roomError =
    roomErrorState?.roomId === roomId ? roomErrorState.message : null;

  const roomUsers =
    roomUsersState?.roomId === roomId ? roomUsersState.users : [];

  const remoteCanvasUpdate =
    remoteCanvasState?.roomId === roomId ? remoteCanvasState.update : null;

  /*
   * ========================================================
   * STATUS
   * ========================================================
   */

  let status: RealtimeStatus;

  if (!roomId || !isLoaded || !isSignedIn) {
    status = "disconnected";
  } else if (roomError) {
    status = "error";
  } else if (isJoined) {
    status = "joined";
  } else if (socketStatus === "connecting") {
    status = "connecting";
  } else if (socketStatus === "error") {
    status = "error";
  } else if (socketStatus === "connected" || isConnected) {
    status = "connected";
  } else {
    status = "disconnected";
  }

  /*
   * ========================================================
   * SEND CANVAS UPDATE
   * ========================================================
   */

  const sendCanvasUpdate = useCallback(
    (pageId: string, canvasData: Record<string, unknown>): boolean => {
      /*
       * ----------------------------------------------------
       * Page validation
       * ----------------------------------------------------
       */

      if (!pageId) {
        console.warn("[Realtime] Cannot send canvas update without pageId.");

        return false;
      }

      /*
       * ----------------------------------------------------
       * Canvas validation
       * ----------------------------------------------------
       */

      if (!canvasData || typeof canvasData !== "object") {
        console.warn("[Realtime] Cannot send invalid canvas data.");

        return false;
      }

      /*
       * ----------------------------------------------------
       * Socket validation
       * ----------------------------------------------------
       */

      if (!socket.connected) {
        console.warn(
          "[Realtime] Cannot send canvas update: socket disconnected.",
        );

        return false;
      }

      /*
       * ----------------------------------------------------
       * Room validation
       * ----------------------------------------------------
       *
       * IMPORTANT:
       *
       * Read from ref rather than React state.
       *
       * This gives us the actual latest socket-room state
       * without causing lifecycle effects to restart.
       */

      if (!roomId || joinedRoomIdRef.current !== roomId) {
        console.warn("[Realtime] Cannot send canvas update: room not joined.");

        return false;
      }

      /*
       * ----------------------------------------------------
       * Emit
       * ----------------------------------------------------
       */

      socket.emit(
        "canvas:update",
        {
          pageId,
          canvasData,
        },
        (response: CanvasUpdateResponse) => {
          if (!response?.success) {
            console.warn(
              "[Realtime] Canvas update rejected:",
              response?.message ?? "Unknown server error.",
            );
          }
        },
      );

      return true;
    },
    [roomId],
  );

  /*
   * ========================================================
   * SOCKET / ROOM LIFECYCLE
   * ========================================================
   *
   * IMPORTANT:
   *
   * joinedRoomId is intentionally NOT a dependency.
   *
   * This effect should only restart when:
   *
   *     roomId
   *     auth readiness
   *     auth state
   *
   * changes.
   */

  useEffect(() => {
    if (!roomId || !isLoaded || !isSignedIn) {
      /*
       * Clear stale room state.
       */

      joinedRoomIdRef.current = null;

      return;
    }

    let cancelled = false;

    /*
     * ======================================================
     * JOIN ROOM
     * ======================================================
     */

    const joinRoom = () => {
      if (cancelled || !socket.connected) {
        return;
      }

      /*
       * Already joined.
       */

      if (joinedRoomIdRef.current === roomId) {
        return;
      }

      console.info("[Realtime] Joining room:", roomId);

      socket.emit(
        "room:join",
        {
          roomId,
        },
        (response: RoomJoinResponse) => {
          if (cancelled) {
            return;
          }

          /*
           * ----------------------------------------------
           * Join failed
           * ----------------------------------------------
           */

          if (!response?.success) {
            joinedRoomIdRef.current = null;

            setJoinedRoomId(null);

            setRoomErrorState({
              roomId,
              message: response?.message ?? "Failed to join room.",
            });

            console.error("[Realtime] Failed to join room:", response?.message);

            return;
          }

          /*
           * ----------------------------------------------
           * Join successful
           * ----------------------------------------------
           */

          joinedRoomIdRef.current = roomId;

          setJoinedRoomId(roomId);

          setRoomErrorState(null);

          setRoomUsersState({
            roomId,
            users: response.users ?? [],
          });

          console.info("[Realtime] Joined room:", roomId);
        },
      );
    };

    /*
     * ======================================================
     * CONNECT
     * ======================================================
     *
     * Called on:
     *
     *     initial connection
     *     reconnect
     *
     * A reconnect creates a new server-side socket,
     * therefore the room must be joined again.
     */

    const handleConnect = () => {
      if (cancelled) {
        return;
      }

      console.info("[Realtime] Socket connected:", socket.id);

      /*
       * New Socket.IO connection means old server-side
       * room membership is gone.
       */

      joinedRoomIdRef.current = null;

      setJoinedRoomId(null);

      setRoomErrorState(null);

      /*
       * Rejoin the room.
       */

      joinRoom();
    };

    /*
     * ======================================================
     * CONNECT ERROR
     * ======================================================
     */

    const handleConnectError = (error: Error) => {
      if (cancelled) {
        return;
      }

      joinedRoomIdRef.current = null;

      setJoinedRoomId(null);

      setRoomErrorState({
        roomId,
        message: error?.message ?? "Realtime connection failed.",
      });

      console.error("[Realtime] Socket connection error:", error);
    };

    /*
     * ======================================================
     * DISCONNECT
     * ======================================================
     */

    const handleDisconnect = (reason: string) => {
      if (cancelled) {
        return;
      }

      /*
       * The server-side room membership is no longer
       * reliable after disconnect.
       */

      joinedRoomIdRef.current = null;

      setJoinedRoomId(null);

      console.warn("[Realtime] Socket disconnected:", reason);
    };

    /*
     * ======================================================
     * CANVAS UPDATED
     * ======================================================
     *
     * Server sends this event to OTHER users.
     */

    const handleCanvasUpdated = (update: CanvasRealtimeUpdate) => {
      if (cancelled) {
        return;
      }

      /*
       * ----------------------------------------------
       * Validate payload
       * ----------------------------------------------
       */

      if (!update) {
        return;
      }

      if (typeof update.pageId !== "string") {
        console.warn("[Realtime] Ignoring canvas update without valid pageId.");

        return;
      }

      if (!update.canvasData || typeof update.canvasData !== "object") {
        console.warn("[Realtime] Ignoring invalid canvas update.");

        return;
      }

      /*
       * ----------------------------------------------
       * Store remote update
       * ----------------------------------------------
       */

      setRemoteCanvasState({
        roomId,
        update,
      });

      console.info("[Realtime] Received canvas update:", {
        pageId: update.pageId,
        userId: update.userId ?? "another user",
      });
    };

    /*
     * ======================================================
     * REGISTER EVENTS
     * ======================================================
     */

    socket.on("connect", handleConnect);

    socket.on("connect_error", handleConnectError);

    socket.on("disconnect", handleDisconnect);

    socket.on("canvas:updated", handleCanvasUpdated);

    /*
     * ======================================================
     * ALREADY CONNECTED
     * ======================================================
     *
     * useSocketConnection may connect before this effect
     * registers its listeners.
     */

    if (socket.connected) {
      joinRoom();
    }

    /*
     * ======================================================
     * CLEANUP
     * ======================================================
     */

    return () => {
      cancelled = true;

      /*
       * ----------------------------------------------------
       * Remove listeners
       * ----------------------------------------------------
       */

      socket.off("connect", handleConnect);

      socket.off("connect_error", handleConnectError);

      socket.off("disconnect", handleDisconnect);

      socket.off("canvas:updated", handleCanvasUpdated);

      /*
       * ----------------------------------------------------
       * Leave room
       * ----------------------------------------------------
       *
       * IMPORTANT:
       *
       * This happens ONLY when this effect lifecycle is
       * actually being destroyed:
       *
       *     room changed
       *     component unmounted
       *     auth changed
       *
       * NOT when joinedRoomId state changes.
       */

      if (joinedRoomIdRef.current === roomId && socket.connected) {
        console.info("[Realtime] Leaving room:", roomId);

        socket.emit("room:leave", {}, (response: RoomLeaveResponse) => {
          if (!response?.success) {
            console.warn(
              "[Realtime] Failed to leave room:",
              response?.message ?? "Unknown server error.",
            );

            return;
          }

          console.info("[Realtime] Left room:", roomId);
        });
      }

      /*
       * Clear local room state.
       */

      joinedRoomIdRef.current = null;

      setJoinedRoomId((current) => (current === roomId ? null : current));

      setRoomUsersState((current) =>
        current?.roomId === roomId ? null : current,
      );

      setRemoteCanvasState((current) =>
        current?.roomId === roomId ? null : current,
      );
    };
  }, [roomId, isLoaded, isSignedIn]);

  /*
   * ========================================================
   * RETURN
   * ========================================================
   */

  return {
    /*
     * Connection
     */

    status,

    isConnected,

    isJoined,

    /*
     * Room
     */

    roomError,

    roomUsers,

    /*
     * Canvas realtime
     */

    remoteCanvasUpdate,

    /*
     * Actions
     */

    sendCanvasUpdate,
  };
}
