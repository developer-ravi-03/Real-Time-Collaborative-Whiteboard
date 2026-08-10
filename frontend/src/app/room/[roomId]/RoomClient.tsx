"use client";

import { useEffect, useState } from "react";
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
    } catch (error) {
      console.error("Failed to update member role:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!room) return;

    try {
      setActionLoading(true);

      await apiRequest(getToken, `/rooms/${room.id}/members/${memberId}`, {
        method: "DELETE",
      });

      setRoom((current) => {
        if (!current) return current;

        return {
          ...current,
          members: current.members.filter(
            (member) => member.memberId !== memberId,
          ),
          memberCount: Math.max(0, current.memberCount - 1),
        };
      });
    } catch (error) {
      console.error("Failed to remove member:", error);
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

      setRoom((current) =>
        current
          ? {
              ...current,
              boards: [response.data, ...current.boards],
            }
          : current,
      );

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

    try {
      setBoardLoading(true);

      await apiRequest(getToken, `/boards/${selectedBoardId}`, {
        method: "DELETE",
      });

      setRoom((current) =>
        current
          ? {
              ...current,
              boards: current.boards.filter(
                (board) => board.id !== selectedBoardId,
              ),
            }
          : current,
      );

      setSelectedBoardId(null);
      setConfirmBoardDelete(false);
    } catch (error) {
      console.error("Failed to delete board:", error);
    } finally {
      setBoardLoading(false);
    }
  };

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
