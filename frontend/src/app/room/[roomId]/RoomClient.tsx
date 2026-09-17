"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiRequest } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { RoomDetails, RoomRole, RoomBoard } from "@/types/room";
import { RoomHeader } from "@/components/room/RoomHeader";
import { RoomOverview } from "@/components/room/RoomOverview";
import { RoomBoards } from "@/components/room/RoomBoards";
import { RoomMembers } from "@/components/room/RoomMembers";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EditRoomModal } from "@/components/room/EditRoomModal";
import { CreateBoardModal } from "@/components/room/CreateBoardModal";
import { EditBoardModal } from "@/components/room/EditBoardModal";
import { useBoardRealtime } from "@/hooks/useBoardRealtime";

type RoomClientProps = {
  roomId: string;
};

type UpdatedMemberResponse = {
  memberId: string;
  role: RoomRole;
  user: {
    id: string;
    displayName: string;
    imageUrl?: string | null;
  };
};

export default function RoomClient({ roomId }: RoomClientProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [room, setRoom] = useState<RoomDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const {
    roomUsers,

    remoteBoardChange,
    sendBoardChange,

    remoteMemberRoleChange,
    sendMemberRoleChange,

    remoteMemberRemoved,
    sendMemberRemove,

    remoteSessionChange,
  } = useBoardRealtime(roomId);

  const [showEditRoom, setShowEditRoom] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editVisibility, setEditVisibility] = useState<"PUBLIC" | "PRIVATE">(
    "PRIVATE",
  );

  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<
    "delete" | "leave" | "close" | "reopen" | null
  >(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [showCreateBoard, setShowCreateBoard] = useState(false);

  const [showEditBoard, setShowEditBoard] = useState(false);

  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

  const [confirmBoardDelete, setConfirmBoardDelete] = useState(false);

  const [boardName, setBoardName] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [boardType, setBoardType] = useState<"INFINITE" | "SLIDES">("INFINITE");

  const [boardLoading, setBoardLoading] = useState(false);
  const [boardError, setBoardError] = useState<string | null>(null);

  const [showKickedNotification, setShowKickedNotification] = useState(false);

  const handleOpenEditRoom = () => {
    if (!room) return;

    setEditName(room.name);
    setEditDescription(room.description || "");
    setEditVisibility(room.visibility);

    setEditError(null);
    setShowEditRoom(true);
  };

  const handleUpdateRoom = async () => {
    if (!room) return;

    if (!editName.trim()) {
      setEditError("Room name is required.");
      return;
    }

    try {
      setEditing(true);
      setEditError(null);

      const response = await apiRequest<ApiResponse<RoomDetails>>(
        getToken,
        `/rooms/${room.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: editName.trim(),
            description: editDescription.trim() || undefined,
            visibility: editVisibility,
          }),
        },
      );

      setRoom(response.data);

      setShowEditRoom(false);
    } catch (error) {
      setEditError(
        error instanceof Error ? error.message : "Failed to update room.",
      );
    } finally {
      setEditing(false);
    }
  };

  const handleSessionAction = async () => {
    if (!room) return;

    try {
      setActionLoading(true);

      const endpoint = room.isSessionActive
        ? `/rooms/${room.id}/close`
        : `/rooms/${room.id}/reopen`;

      await apiRequest(getToken, endpoint, {
        method: "POST",
      });

      setRoom((current) =>
        current
          ? {
              ...current,
              isSessionActive: !current.isSessionActive,
            }
          : current,
      );

      setConfirmAction(null);
    } catch (error) {
      console.error("Session action failed:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!room) return;

    try {
      setActionLoading(true);

      await apiRequest(getToken, `/rooms/${room.id}/leave`, {
        method: "DELETE",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to leave room:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!room) return;

    try {
      setActionLoading(true);

      await apiRequest(getToken, `/rooms/${room.id}`, {
        method: "DELETE",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to delete room:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateMemberRole = async (
    memberId: string,
    role: Exclude<RoomRole, "OWNER">,
  ) => {
    if (!room) return;

    try {
      setActionLoading(true);

      await apiRequest<ApiResponse<UpdatedMemberResponse>>(
        getToken,
        `/rooms/${room.id}/members/${memberId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            role,
          }),
        },
      );

      /*
       * Update current client immediately.
       */
      setRoom((current) => {
        if (!current) return current;

        return {
          ...current,
          members: current.members.map((member) =>
            member.memberId === memberId
              ? {
                  ...member,
                  role,
                }
              : member,
          ),
        };
      });

      /*
       * Notify other connected clients.
       *
       * REST API has already completed the actual
       * database mutation.
       */
      sendMemberRoleChange(memberId, role);
    } catch (error) {
      console.error("Failed to update member role:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!room) return;

    const memberToRemove = room.members.find(
      (member) => member.memberId === memberId,
    );

    if (!memberToRemove) {
      console.warn("[Room] Member not found:", memberId);
      return;
    }

    const removedUserId = memberToRemove.user.id;

    try {
      setActionLoading(true);

      await apiRequest(getToken, `/rooms/${room.id}/members/${memberId}`, {
        method: "DELETE",
      });

      /*
       * Update current client's member list immediately.
       */
      setRoom((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          members: current.members.filter(
            (member) => member.memberId !== memberId,
          ),
          memberCount: Math.max(0, current.memberCount - 1),
        };
      });

      /*
       * REST mutation succeeded.
       *
       * Now notify the realtime layer.
       */
      const sent = sendMemberRemove(memberId, removedUserId);

      if (!sent) {
        console.warn(
          "[Room] Member removed successfully, but realtime notification could not be sent.",
        );
      }
    } catch (error) {
      console.error("[Room] Failed to remove member:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!room) return;

    if (!boardName.trim()) {
      setBoardError("Board name is required.");
      return;
    }

    try {
      setBoardLoading(true);
      setBoardError(null);

      const response = await apiRequest<ApiResponse<RoomBoard>>(
        getToken,
        `/rooms/${room.id}/boards`,
        {
          method: "POST",
          body: JSON.stringify({
            name: boardName.trim(),
            description: boardDescription.trim() || undefined,
            type: boardType,
          }),
        },
      );

      // Update current client immediately.
      setRoom((current) =>
        current
          ? {
              ...current,
              boards: [response.data, ...current.boards],
            }
          : current,
      );

      // Notify other clients about the successful REST mutation.
      sendBoardChange(response.data.id, "created");

      setBoardName("");
      setBoardDescription("");
      setBoardType("INFINITE");

      setShowCreateBoard(false);
    } catch (error) {
      setBoardError(
        error instanceof Error ? error.message : "Failed to create board.",
      );
    } finally {
      setBoardLoading(false);
    }
  };

  const handleOpenEditBoard = (boardId: string) => {
    if (!room) return;

    const board = room.boards.find((item) => item.id === boardId);

    if (!board) return;

    setSelectedBoardId(board.id);
    setBoardName(board.name);
    setBoardDescription(board.description || "");
    setBoardError(null);
    setShowEditBoard(true);
  };

  const handleUpdateBoard = async () => {
    if (!selectedBoardId) return;

    if (!boardName.trim()) {
      setBoardError("Board name is required.");
      return;
    }

    try {
      setBoardLoading(true);
      setBoardError(null);

      const response = await apiRequest<ApiResponse<RoomBoard>>(
        getToken,
        `/boards/${selectedBoardId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: boardName.trim(),
            description: boardDescription.trim() || undefined,
          }),
        },
      );

      // Update current client immediately.
      setRoom((current) =>
        current
          ? {
              ...current,
              boards: current.boards.map((board) =>
                board.id === selectedBoardId ? response.data : board,
              ),
            }
          : current,
      );

      // Notify other clients about the successful REST mutation.
      sendBoardChange(response.data.id, "updated");

      setShowEditBoard(false);
      setSelectedBoardId(null);
    } catch (error) {
      setBoardError(
        error instanceof Error ? error.message : "Failed to update board.",
      );
    } finally {
      setBoardLoading(false);
    }
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoardId) return;

    /*
     * Store the ID before deleting because selectedBoardId
     * will be cleared after the operation.
     */
    const boardIdToDelete = selectedBoardId;

    try {
      setBoardLoading(true);
      setBoardError(null);

      await apiRequest(getToken, `/boards/${boardIdToDelete}`, {
        method: "DELETE",
      });

      // Update current client immediately.
      setRoom((current) =>
        current
          ? {
              ...current,
              boards: current.boards.filter(
                (board) => board.id !== boardIdToDelete,
              ),
            }
          : current,
      );

      // Notify other clients about the successful REST mutation.
      sendBoardChange(boardIdToDelete, "deleted");

      setSelectedBoardId(null);
      setConfirmBoardDelete(false);
    } catch (error) {
      console.error("Failed to delete board:", error);

      setBoardError(
        error instanceof Error ? error.message : "Failed to delete board.",
      );
    } finally {
      setBoardLoading(false);
    }
  };

  const refreshRoom = useCallback(async () => {
    const response = await apiRequest<ApiResponse<RoomDetails>>(
      getToken,
      `/rooms/${roomId}`,
    );

    setRoom(response.data);

    return response.data;
  }, [getToken, roomId]);

  useEffect(() => {
    if (!remoteBoardChange) {
      return;
    }

    const refreshTimer = window.setTimeout(() => {
      void refreshRoom();
    }, 0);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [remoteBoardChange, refreshRoom]);

  useEffect(() => {
    if (!remoteMemberRoleChange) {
      return;
    }

    const refreshTimer = window.setTimeout(() => {
      void refreshRoom();
    }, 0);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [remoteMemberRoleChange, refreshRoom]);

  const presenceKey = roomUsers
    .map((user) => user.userId)
    .sort()
    .join("|");

  useEffect(() => {
    if (!presenceKey) {
      return;
    }

    const refreshTimer = window.setTimeout(() => {
      void refreshRoom();
    }, 0);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [presenceKey, refreshRoom]);

  useEffect(() => {
    if (!remoteMemberRemoved) {
      return;
    }

    /*
     * The backend sends kicked=true only to the
     * socket(s) belonging to the removed user.
     */
    if (remoteMemberRemoved.kicked) {
      const notificationTimer = window.setTimeout(() => {
        setShowKickedNotification(true);
      }, 0);

      const redirectTimer = window.setTimeout(() => {
        router.replace("/dashboard");
      }, 2200);

      return () => {
        window.clearTimeout(notificationTimer);
        window.clearTimeout(redirectTimer);
      };
    }

    /*
     * Another member was removed.
     *
     * Presence update normally handles the member list,
     * but this event also invalidates the room state.
     */
    const refreshTimer = window.setTimeout(() => {
      void refreshRoom();
    }, 0);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [remoteMemberRemoved, refreshRoom, router]);

  useEffect(() => {
    if (!remoteSessionChange) {
      return;
    }

    const refreshTimer = window.setTimeout(() => {
      void refreshRoom();
    }, 0);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [remoteSessionChange, refreshRoom]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    let cancelled = false;

    const loadRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        // Wait for Clerk token
        let token: string | null = null;

        for (let attempt = 0; attempt < 10; attempt++) {
          if (cancelled) return;

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

        const response = await apiRequest<ApiResponse<RoomDetails>>(
          getToken,
          `/rooms/${roomId}`,
        );

        if (!cancelled) {
          setRoom(response.data);
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load room:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load room.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadRoom();

    return () => {
      cancelled = true;
    };
  }, [roomId, isLoaded, isSignedIn, getToken]);

  if (loading) {
    return <RoomLoading />;
  }

  if (error || !room) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <h2 className="font-semibold text-destructive">
              Unable to load room
            </h2>

            <p className="mt-2 text-sm text-destructive/80">
              {error || "Room not found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {showKickedNotification && (
        <div
          className="
          fixed
          right-5
          top-5
          z-[9999]
          w-[min(380px,calc(100vw-2rem))]
          rounded-2xl
          border
          border-destructive/30
          bg-background/95
          p-4
          shadow-2xl
          backdrop-blur-xl
        "
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <div
              className="
              flex
              h-9
              w-9
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
              <p className="font-semibold">You were removed from this room</p>

              <p className="mt-1 text-sm text-muted-foreground">
                The room owner removed you from this room. Redirecting to
                dashboard...
              </p>
            </div>
          </div>
        </div>
      )}

      <RoomHeader
        room={room}
        onEdit={handleOpenEditRoom}
        onCloseSession={() => setConfirmAction("close")}
        onReopenSession={() => setConfirmAction("reopen")}
        onLeave={() => setConfirmAction("leave")}
        onDelete={() => setConfirmAction("delete")}
      />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
          <RoomOverview room={room} />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <RoomBoards
              boards={room.boards}
              yourRole={room.yourRole}
              isSessionActive={room.isSessionActive}
              onCreateBoard={() => {
                setBoardName("");
                setBoardDescription("");
                setBoardType("INFINITE");
                setBoardError(null);
                setShowCreateBoard(true);
              }}
              onEditBoard={handleOpenEditBoard}
              onDeleteBoard={(boardId) => {
                setSelectedBoardId(boardId);
                setConfirmBoardDelete(true);
              }}
            />

            <RoomMembers
              members={room.members}
              memberCount={room.memberCount}
              yourRole={room.yourRole}
              onUpdateRole={handleUpdateMemberRole}
              onRemoveMember={handleRemoveMember}
              actionLoading={actionLoading}
            />
          </div>
        </section>
      </main>

      <EditRoomModal
        open={showEditRoom}
        name={editName}
        description={editDescription}
        visibility={editVisibility}
        loading={editing}
        error={editError}
        onNameChange={setEditName}
        onDescriptionChange={setEditDescription}
        onVisibilityChange={setEditVisibility}
        onClose={() => setShowEditRoom(false)}
        onSubmit={handleUpdateRoom}
      />

      <ConfirmDialog
        open={confirmAction === "delete"}
        title="Delete this room?"
        description="This will permanently delete the room and its associated data. This action cannot be undone."
        confirmText="Delete Room"
        destructive
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) {
            setConfirmAction(null);
          }
        }}
        onConfirm={handleDeleteRoom}
      />

      <ConfirmDialog
        open={confirmAction === "leave"}
        title="Leave this room?"
        description="You will no longer have access to this room unless you join it again."
        confirmText="Leave Room"
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) {
            setConfirmAction(null);
          }
        }}
        onConfirm={handleLeaveRoom}
      />

      <ConfirmDialog
        open={confirmAction === "close" || confirmAction === "reopen"}
        title={
          confirmAction === "close"
            ? "Close this session?"
            : "Reopen this session?"
        }
        description={
          confirmAction === "close"
            ? "Closing the session will prevent active collaboration until the owner reopens it."
            : "Reopening the session will allow members to continue collaborating."
        }
        confirmText={
          confirmAction === "close" ? "Close Session" : "Reopen Session"
        }
        loading={actionLoading}
        onClose={() => {
          if (!actionLoading) {
            setConfirmAction(null);
          }
        }}
        onConfirm={handleSessionAction}
      />

      <CreateBoardModal
        open={showCreateBoard}
        name={boardName}
        description={boardDescription}
        type={boardType}
        loading={boardLoading}
        error={boardError}
        onNameChange={setBoardName}
        onDescriptionChange={setBoardDescription}
        onTypeChange={setBoardType}
        onClose={() => {
          if (!boardLoading) {
            setShowCreateBoard(false);
          }
        }}
        onSubmit={handleCreateBoard}
      />

      <EditBoardModal
        open={showEditBoard}
        name={boardName}
        description={boardDescription}
        loading={boardLoading}
        error={boardError}
        onNameChange={setBoardName}
        onDescriptionChange={setBoardDescription}
        onClose={() => {
          if (!boardLoading) {
            setShowEditBoard(false);
            setSelectedBoardId(null);
          }
        }}
        onSubmit={handleUpdateBoard}
      />

      <ConfirmDialog
        open={confirmBoardDelete}
        title="Delete this board?"
        description="This will permanently delete the board and its pages. This action cannot be undone."
        confirmText="Delete Board"
        destructive
        loading={boardLoading}
        onClose={() => {
          if (!boardLoading) {
            setConfirmBoardDelete(false);
            setSelectedBoardId(null);
          }
        }}
        onConfirm={handleDeleteBoard}
      />
    </>
  );
}

function RoomLoading() {
  return (
    <main className="min-h-screen">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-6 w-48 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-72 animate-pulse rounded-md bg-muted/70" />
            </div>

            <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        <div className="h-36 animate-pulse rounded-2xl bg-muted/40" />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="h-80 animate-pulse rounded-2xl bg-muted/40" />

          <div className="h-80 animate-pulse rounded-2xl bg-muted/40" />
        </div>
      </section>
    </main>
  );
}
