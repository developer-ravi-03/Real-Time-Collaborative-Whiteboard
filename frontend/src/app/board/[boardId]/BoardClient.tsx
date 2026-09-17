"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { apiRequest } from "@/lib/api-client";

import type { ApiResponse } from "@/types/api";

import type {
  Board,
  BoardInitialization,
  BoardPage,
  CurrentPage,
} from "@/types/board";

import type { RoomRole } from "@/types/room";

import { BoardHeader } from "@/components/board/BoardHeader";
import { BoardSidebar } from "@/components/board/BoardSidebar";

import { CreatePageModal } from "@/components/board/CreatePageModal";
import { EditPageModal } from "@/components/board/EditPageModal";
import { DeletePageDialog } from "@/components/board/DeletePageDialog";

import { CanvasWorkspace } from "@/components/canvas/CanvasWorkspace";

import { useBoardRealtime } from "@/hooks/useBoardRealtime";

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

type BoardClientProps = {
  boardId: string;
};

/*
 * ==========================================================
 * COMPONENT
 * ==========================================================
 */

export default function BoardClient({ boardId }: BoardClientProps) {
  /*
   * ========================================================
   * AUTH / ROUTER
   * ========================================================
   */

  const { getToken, isLoaded, isSignedIn } = useAuth();

  const router = useRouter();

  /*
   * ========================================================
   * BOARD STATE
   * ========================================================
   */

  const [board, setBoard] = useState<Board | null>(null);

  const [pages, setPages] = useState<BoardPage[]>([]);

  const [currentPage, setCurrentPage] = useState<CurrentPage | null>(null);

  const [yourRole, setYourRole] = useState<RoomRole | null>(null);

  /*
   * ========================================================
   * PAGE SELECTION
   * ========================================================
   */

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  /*
   * ========================================================
   * BOARD LOADING
   * ========================================================
   */

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  /*
   * ========================================================
   * PAGE ACTION LOADING
   * ========================================================
   */

  const [pageLoading, setPageLoading] = useState(false);

  /*
   * ========================================================
   * CREATE PAGE
   * ========================================================
   */

  const [showCreatePage, setShowCreatePage] = useState(false);

  const [newPageTitle, setNewPageTitle] = useState("");

  const [createPageError, setCreatePageError] = useState<string | null>(null);

  /*
   * ========================================================
   * EDIT PAGE
   * ========================================================
   */

  const [showEditPage, setShowEditPage] = useState(false);

  const [pageTitle, setPageTitle] = useState("");

  const [pageError, setPageError] = useState<string | null>(null);

  /*
   * ========================================================
   * DELETE PAGE
   * ========================================================
   */

  const [deletePageId, setDeletePageId] = useState<string | null>(null);

  /*
   * ========================================================
   * BOARD DELETE NOTIFICATION
   * ========================================================
   *
   * When another user deletes the board that this client
   * currently has open:
   *
   *     socket event
   *          ↓
   *     notification
   *          ↓
   *     redirect to room
   */

  const [boardDeletedNotification, setBoardDeletedNotification] =
    useState(false);

  /*
   * ========================================================
   * REALTIME
   * ========================================================
   */

  const {
    status: realtimeStatus,
    roomError: realtimeError,
    remoteCanvasUpdate,
    sendCanvasUpdate,
    remoteMemberRoleChange,
    remoteBoardChange,
  } = useBoardRealtime(board?.roomId ?? null);

  /*
   * ========================================================
   * APPLY BOARD INITIALIZATION
   * ========================================================
   *
   * Keeps board state updates in one place.
   *
   * Used by:
   *
   *     1. Initial board loading
   *     2. Role-change realtime refresh
   */

  const applyBoardInitialization = useCallback((data: BoardInitialization) => {
    setBoard(data.board);

    setPages(data.pages);

    setCurrentPage(data.currentPage);

    setYourRole(data.yourRole);

    if (data.currentPage) {
      setSelectedPageId(data.currentPage.id);
    }
  }, []);

  /*
   * ========================================================
   * REFRESH BOARD
   * ========================================================
   *
   * REST remains the source of truth.
   *
   * Socket.IO only tells us that the state changed.
   */

  const refreshBoard = useCallback(async () => {
    const response = await apiRequest<ApiResponse<BoardInitialization>>(
      getToken,
      `/boards/${boardId}/initialize`,
    );

    applyBoardInitialization(response.data);

    return response.data;
  }, [applyBoardInitialization, boardId, getToken]);

  /*
   * ========================================================
   * CANVAS REALTIME BRIDGE
   * ========================================================
   */

  const handleCanvasRealtimeUpdate = useCallback(
    (pageId: string, canvasData: Record<string, unknown>) => {
      sendCanvasUpdate(pageId, canvasData);
    },
    [sendCanvasUpdate],
  );

  /*
   * ========================================================
   * BOARD REALTIME
   * ========================================================
   *
   * Handle board changes received from other users.
   *
   * created / updated:
   *     refresh current board state.
   *
   * deleted:
   *     if this exact board was deleted,
   *     notify the user and redirect to room.
   */

  useEffect(() => {
    if (!remoteBoardChange) {
      return;
    }

    /*
     * ======================================================
     * CURRENT BOARD DELETED
     * ======================================================
     */

    if (
      remoteBoardChange.action === "deleted" &&
      remoteBoardChange.boardId === boardId
    ) {
      const notificationTimer = window.setTimeout(() => {
        setBoardDeletedNotification(true);
      }, 0);

      const redirectTimer = window.setTimeout(() => {
        if (board?.roomId) {
          router.replace(`/room/${board.roomId}`);
        } else {
          router.replace("/dashboard");
        }
      }, 1200);

      return () => {
        window.clearTimeout(notificationTimer);
        window.clearTimeout(redirectTimer);
      };
    }

    /*
     * ======================================================
     * OTHER BOARD CREATED / UPDATED
     * ======================================================
     */

    if (
      remoteBoardChange.action === "created" ||
      remoteBoardChange.action === "updated"
    ) {
      const refreshTimer = window.setTimeout(() => {
        void refreshBoard();
      }, 0);

      return () => {
        window.clearTimeout(refreshTimer);
      };
    }
  }, [boardId, board?.roomId, refreshBoard, remoteBoardChange, router]);

  /*
   * ========================================================
   * MEMBER ROLE REALTIME
   * ========================================================
   *
   * A role change can affect:
   *
   *     - yourRole
   *     - canEdit
   *     - page permissions
   *     - canvas permissions
   */

  useEffect(() => {
    if (!remoteMemberRoleChange) {
      return;
    }

    /*
     * Do not refresh synchronously inside the effect.
     *
     * This avoids React Compiler's cascading-render
     * warning.
     */

    const refreshTimer = window.setTimeout(() => {
      void refreshBoard();
    }, 0);

    return () => {
      window.clearTimeout(refreshTimer);
    };
  }, [remoteMemberRoleChange, refreshBoard]);

  /*
   * ========================================================
   * REFRESH PAGES
   * ========================================================
   */

  const refreshPages = async () => {
    const response = await apiRequest<ApiResponse<BoardPage[]>>(
      getToken,
      `/boards/${boardId}/pages`,
    );

    setPages(response.data);

    return response.data;
  };

  /*
   * ========================================================
   * CREATE PAGE
   * ========================================================
   */

  const handleCreatePage = async () => {
    if (!board) {
      return;
    }

    const title = newPageTitle.trim();

    /*
     * Backend requires a non-empty title.
     */

    if (!title) {
      setCreatePageError("Page name is required.");

      return;
    }

    try {
      setPageLoading(true);

      setCreatePageError(null);

      /*
       * ----------------------------------------------------
       * Create page
       * ----------------------------------------------------
       */

      const response = await apiRequest<
        ApiResponse<
          BoardPage & {
            canvasData?: Record<string, unknown>;
          }
        >
      >(getToken, `/boards/${board.id}/pages`, {
        method: "POST",

        body: JSON.stringify({
          title,
        }),
      });

      const newPage = response.data;

      /*
       * ----------------------------------------------------
       * Add page to sidebar
       * ----------------------------------------------------
       */

      setPages((current) => [
        ...current,

        {
          id: newPage.id,
          pageNumber: newPage.pageNumber,
          title: newPage.title,
          version: newPage.version,
          thumbnailUrl: newPage.thumbnailUrl,
          updatedAt: newPage.updatedAt,
        },
      ]);

      /*
       * ----------------------------------------------------
       * Load complete page
       * ----------------------------------------------------
       */

      const pageResponse = await apiRequest<ApiResponse<CurrentPage>>(
        getToken,
        `/pages/${newPage.id}`,
      );

      /*
       * ----------------------------------------------------
       * Make new page active
       * ----------------------------------------------------
       */

      setCurrentPage(pageResponse.data);

      setSelectedPageId(newPage.id);

      /*
       * ----------------------------------------------------
       * Close modal
       * ----------------------------------------------------
       */

      setShowCreatePage(false);

      setNewPageTitle("");

      setCreatePageError(null);
    } catch (error) {
      setCreatePageError(
        error instanceof Error ? error.message : "Failed to create page.",
      );
    } finally {
      setPageLoading(false);
    }
  };

  /*
   * ========================================================
   * SELECT PAGE
   * ========================================================
   */

  const handleSelectPage = async (pageId: string) => {
    /*
     * Already selected.
     */

    if (pageId === selectedPageId) {
      return;
    }

    try {
      setPageLoading(true);

      setPageError(null);

      /*
       * ----------------------------------------------------
       * Load selected page
       * ----------------------------------------------------
       */

      const response = await apiRequest<ApiResponse<CurrentPage>>(
        getToken,
        `/pages/${pageId}`,
      );

      /*
       * ----------------------------------------------------
       * Update active page
       * ----------------------------------------------------
       */

      setSelectedPageId(pageId);

      setCurrentPage(response.data);
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Failed to load page.",
      );
    } finally {
      setPageLoading(false);
    }
  };

  /*
   * ========================================================
   * OPEN EDIT PAGE
   * ========================================================
   */

  const handleOpenEditPage = (pageId: string) => {
    const page = pages.find((item) => item.id === pageId);

    if (!page) {
      return;
    }

    setSelectedPageId(pageId);

    setPageTitle(page.title || "");

    setPageError(null);

    setShowEditPage(true);
  };

  /*
   * ========================================================
   * UPDATE PAGE
   * ========================================================
   */

  const handleUpdatePage = async () => {
    if (!selectedPageId) {
      return;
    }

    const title = pageTitle.trim();

    /*
     * Backend requires a non-empty title.
     */

    if (!title) {
      setPageError("Page name is required.");

      return;
    }

    try {
      setPageLoading(true);

      setPageError(null);

      const response = await apiRequest<ApiResponse<CurrentPage>>(
        getToken,
        `/pages/${selectedPageId}`,
        {
          method: "PATCH",

          body: JSON.stringify({
            title,
          }),
        },
      );

      /*
       * ----------------------------------------------------
       * Update current page
       * ----------------------------------------------------
       */

      setCurrentPage(response.data);

      /*
       * ----------------------------------------------------
       * Update sidebar page
       * ----------------------------------------------------
       */

      setPages((current) =>
        current.map((page) =>
          page.id === selectedPageId
            ? {
                ...page,

                title: response.data.title,

                version: response.data.version,

                updatedAt: response.data.updatedAt,
              }
            : page,
        ),
      );

      /*
       * ----------------------------------------------------
       * Close modal
       * ----------------------------------------------------
       */

      setShowEditPage(false);

      setPageTitle("");
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Failed to update page.",
      );
    } finally {
      setPageLoading(false);
    }
  };

  /*
   * ========================================================
   * DELETE PAGE
   * ========================================================
   */

  const handleDeletePage = async () => {
    if (!deletePageId) {
      return;
    }

    /*
     * A board must always retain
     * at least one page.
     */

    if (pages.length <= 1) {
      setDeletePageId(null);

      setPageError("A board must have at least one page.");

      return;
    }

    try {
      setPageLoading(true);

      setPageError(null);

      const deletedPageId = deletePageId;

      /*
       * ----------------------------------------------------
       * Delete from backend
       * ----------------------------------------------------
       */

      await apiRequest(getToken, `/pages/${deletedPageId}`, {
        method: "DELETE",
      });

      /*
       * ----------------------------------------------------
       * Refresh page list
       * ----------------------------------------------------
       */

      const freshPages = await refreshPages();

      /*
       * ----------------------------------------------------
       * If deleted page was active,
       * select another page.
       * ----------------------------------------------------
       */

      if (selectedPageId === deletedPageId) {
        const nextPage = freshPages[0];

        if (nextPage) {
          const response = await apiRequest<ApiResponse<CurrentPage>>(
            getToken,
            `/pages/${nextPage.id}`,
          );

          setSelectedPageId(nextPage.id);

          setCurrentPage(response.data);
        } else {
          /*
           * Defensive fallback.
           */

          setSelectedPageId(null);

          setCurrentPage(null);
        }
      }

      /*
       * ----------------------------------------------------
       * Close dialog
       * ----------------------------------------------------
       */

      setDeletePageId(null);

      setPageError(null);
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Failed to delete page.",
      );
    } finally {
      setPageLoading(false);
    }
  };

  /*
   * ========================================================
   * INITIALIZE BOARD
   * ========================================================
   */

  useEffect(() => {
    /*
     * Wait for Clerk.
     */

    if (!isLoaded || !isSignedIn) {
      return;
    }

    let cancelled = false;

    const initializeBoard = async () => {
      try {
        setLoading(true);

        setError(null);

        /*
         * ------------------------------------------------
         * Ensure Clerk token is ready
         * ------------------------------------------------
         */

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

        /*
         * ------------------------------------------------
         * Initialize board
         * ------------------------------------------------
         */

        const response = await apiRequest<ApiResponse<BoardInitialization>>(
          getToken,
          `/boards/${boardId}/initialize`,
        );

        if (cancelled) {
          return;
        }

        /*
         * ------------------------------------------------
         * Apply board state
         * ------------------------------------------------
         */

        applyBoardInitialization(response.data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Failed to initialize board:", error);

        setError(
          error instanceof Error ? error.message : "Failed to load board.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void initializeBoard();

    return () => {
      cancelled = true;
    };
  }, [boardId, isLoaded, isSignedIn, getToken, applyBoardInitialization]);

  /*
   * ========================================================
   * LOADING
   * ========================================================
   */

  if (loading) {
    return <BoardLoading />;
  }

  /*
   * ========================================================
   * BOARD ERROR
   * ========================================================
   */

  if (error || !board) {
    return (
      <main className="min-h-screen bg-background">
        <div
          className="
            flex
            min-h-screen
            items-center
            justify-center
            px-6
          "
        >
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold">Unable to load board</h1>

            <p className="mt-2 text-sm text-destructive">
              {error || "Board not found."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="
                mt-6
                rounded-xl
                bg-primary
                px-5
                py-2.5
                text-sm
                font-semibold
                text-primary-foreground
              "
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ========================================================
   * PERMISSIONS
   * ========================================================
   */

  const canEdit =
    yourRole === "OWNER" || yourRole === "ADMIN" || yourRole === "EDITOR";

  const canDeletePage =
    (yourRole === "OWNER" || yourRole === "ADMIN") && pages.length > 1;

  const canCreatePage = board.type === "SLIDES" && canEdit;

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <main
      className="
        flex
        h-screen
        flex-col
        overflow-hidden
        bg-background
      "
    >
      {/* ==================================================
          BOARD DELETED NOTIFICATION
          ================================================== */}

      {boardDeletedNotification && (
        <div
          className="
            fixed
            left-1/2
            top-6
            z-50
            w-[calc(100%-2rem)]
            max-w-md
            -translate-x-1/2
            rounded-xl
            border
            border-red-500/30
            bg-red-950
            px-4
            py-3
            text-white
            shadow-2xl
          "
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <div
              className="
                mt-0.5
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-red-500/20
                text-red-300
              "
            >
              !
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold">Board deleted</p>

              <p className="mt-1 text-xs text-red-100/80">
                This board was deleted by another member. Redirecting you to the
                room...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          BOARD HEADER
          ================================================== */}

      <BoardHeader board={board} realtimeStatus={realtimeStatus} />

      {/*
       * Realtime errors remain accessible
       * without disturbing the layout.
       */}

      {realtimeError && (
        <div className="sr-only" aria-live="polite">
          {realtimeError}
        </div>
      )}

      {/* ==================================================
          BOARD BODY
          ================================================== */}

      <div
        className="
          flex
          min-h-0
          flex-1
          overflow-hidden
        "
      >
        {/* ==================================================
            SIDEBAR
            ================================================== */}

        <BoardSidebar
          board={board}
          pages={pages}
          selectedPageId={selectedPageId}
          canCreatePage={canCreatePage}
          canEditPage={canEdit}
          canDeletePage={canDeletePage}
          onSelectPage={handleSelectPage}
          onCreatePage={() => {
            setNewPageTitle("");

            setCreatePageError(null);

            setShowCreatePage(true);
          }}
          onEditPage={handleOpenEditPage}
          onDeletePage={(pageId) => {
            setPageError(null);

            setDeletePageId(pageId);
          }}
        />

        {/* ==================================================
            CANVAS
            ================================================== */}

        <section
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          <CanvasWorkspace
            board={board}
            currentPage={currentPage}
            canEdit={canEdit}
            remoteCanvasUpdate={remoteCanvasUpdate}
            onCanvasRealtimeUpdate={handleCanvasRealtimeUpdate}
          />
        </section>
      </div>

      {/* ==================================================
          CREATE PAGE MODAL
          ================================================== */}

      <CreatePageModal
        open={showCreatePage}
        title={newPageTitle}
        loading={pageLoading}
        error={createPageError}
        onTitleChange={setNewPageTitle}
        onClose={() => {
          if (pageLoading) {
            return;
          }

          setShowCreatePage(false);

          setCreatePageError(null);
        }}
        onSubmit={handleCreatePage}
      />

      {/* ==================================================
          EDIT PAGE MODAL
          ================================================== */}

      <EditPageModal
        open={showEditPage}
        title={pageTitle}
        loading={pageLoading}
        error={pageError}
        onTitleChange={setPageTitle}
        onClose={() => {
          if (pageLoading) {
            return;
          }

          setShowEditPage(false);

          setPageError(null);
        }}
        onSubmit={handleUpdatePage}
      />

      {/* ==================================================
          DELETE PAGE DIALOG
          ================================================== */}

      <DeletePageDialog
        open={deletePageId !== null}
        loading={pageLoading}
        onClose={() => {
          if (pageLoading) {
            return;
          }

          setDeletePageId(null);

          setPageError(null);
        }}
        onConfirm={handleDeletePage}
      />
    </main>
  );
}

/*
 * ==========================================================
 * BOARD LOADING
 * ==========================================================
 */

function BoardLoading() {
  return (
    <main
      className="
        flex
        h-screen
        flex-col
        overflow-hidden
        bg-background
      "
    >
      {/* Header skeleton */}

      <div
        className="
          h-16
          animate-pulse
          border-b
          bg-muted/30
        "
      />

      {/* Body skeleton */}

      <div
        className="
          flex
          min-h-0
          flex-1
        "
      >
        {/* Sidebar */}

        <div
          className="
            w-64
            shrink-0
            animate-pulse
            border-r
            bg-muted/20
          "
        />

        {/* Canvas */}

        <div
          className="
            min-w-0
            flex-1
            animate-pulse
            bg-muted/10
          "
        />
      </div>
    </main>
  );
}
