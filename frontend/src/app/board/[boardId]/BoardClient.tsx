"use client";

import { useEffect, useState } from "react";
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

import { BoardHeader } from "@/components/board/BoardHeader";
import { BoardSidebar } from "@/components/board/BoardSidebar";
import { EditPageModal } from "@/components/board/EditPageModal";
import { DeletePageDialog } from "@/components/board/DeletePageDialog";
import type { RoomRole } from "@/types/room";
import { CreatePageModal } from "@/components/board/CreatePageModal";
import { CanvasWorkspace } from "@/components/canvas/CanvasWorkspace";

type BoardClientProps = {
  boardId: string;
};

export default function BoardClient({ boardId }: BoardClientProps) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  const [board, setBoard] = useState<Board | null>(null);
  const [pages, setPages] = useState<BoardPage[]>([]);
  const [currentPage, setCurrentPage] = useState<CurrentPage | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);

  const [pageLoading, setPageLoading] = useState(false);

  const [showEditPage, setShowEditPage] = useState(false);

  const [showCreatePage, setShowCreatePage] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [createPageError, setCreatePageError] = useState<string | null>(null);

  const [pageTitle, setPageTitle] = useState("");
  const [pageError, setPageError] = useState<string | null>(null);

  const [yourRole, setYourRole] = useState<RoomRole | null>(null);

  const [deletePageId, setDeletePageId] = useState<string | null>(null);

  const refreshPages = async () => {
    const response = await apiRequest<ApiResponse<BoardPage[]>>(
      getToken,
      `/boards/${boardId}/pages`,
    );

    setPages(response.data);

    return response.data;
  };

  // Create Page
  const handleCreatePage = async () => {
    if (!board) return;

    const title = newPageTitle.trim();

    if (!title) {
      setCreatePageError("Page name is required.");
      return;
    }

    try {
      setPageLoading(true);
      setCreatePageError(null);

      const response = await apiRequest<
        ApiResponse<BoardPage & { canvasData?: Record<string, unknown> }>
      >(getToken, `/boards/${board.id}/pages`, {
        method: "POST",
        body: JSON.stringify({
          title,
        }),
      });

      const newPage = response.data;

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

      const pageResponse = await apiRequest<ApiResponse<CurrentPage>>(
        getToken,
        `/pages/${newPage.id}`,
      );

      setCurrentPage(pageResponse.data);
      setSelectedPageId(newPage.id);

      // Close modal
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

  // Page switch
  const handleSelectPage = async (pageId: string) => {
    if (pageId === selectedPageId) return;

    try {
      setPageLoading(true);
      setPageError(null);

      const response = await apiRequest<ApiResponse<CurrentPage>>(
        getToken,
        `/pages/${pageId}`,
      );

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

  const handleOpenEditPage = (pageId: string) => {
    const page = pages.find((item) => item.id === pageId);

    if (!page) return;

    setSelectedPageId(pageId);
    setPageTitle(page.title || "");
    setPageError(null);
    setShowEditPage(true);
  };

  // Rename Page
  const handleUpdatePage = async () => {
    if (!selectedPageId) return;

    const title = pageTitle.trim();

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

      setCurrentPage(response.data);

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

      setShowEditPage(false);
    } catch (error) {
      setPageError(
        error instanceof Error ? error.message : "Failed to update page.",
      );
    } finally {
      setPageLoading(false);
    }
  };

  // Delete Page
  const handleDeletePage = async () => {
    if (!deletePageId) return;

    if (pages.length <= 1) {
      setDeletePageId(null);
      setPageError("A board must have at least one page.");
      return;
    }

    try {
      setPageLoading(true);
      setPageError(null);

      const deletedPageId = deletePageId;

      // Delete page from backend
      await apiRequest(getToken, `/pages/${deletedPageId}`, {
        method: "DELETE",
      });

      // Get fresh pages from backend
      const freshPages = await refreshPages();

      // If deleted page was currently selected
      if (selectedPageId === deletedPageId) {
        const nextPage = freshPages[0];

        if (nextPage) {
          // Load the next available page
          const response = await apiRequest<ApiResponse<CurrentPage>>(
            getToken,
            `/pages/${nextPage.id}`,
          );

          setSelectedPageId(nextPage.id);
          setCurrentPage(response.data);
        } else {
          // No pages remaining
          setSelectedPageId(null);
          setCurrentPage(null);
        }
      }

      // Close delete dialog
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

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    let cancelled = false;

    const initializeBoard = async () => {
      try {
        setLoading(true);
        setError(null);

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

        const response = await apiRequest<ApiResponse<BoardInitialization>>(
          getToken,
          `/boards/${boardId}/initialize`,
        );

        if (cancelled) return;

        const data = response.data;

        setBoard(data.board);
        setPages(data.pages);
        setCurrentPage(data.currentPage);
        setYourRole(data.yourRole);

        if (data.currentPage) {
          setSelectedPageId(data.currentPage.id);
        }
      } catch (error) {
        if (cancelled) return;

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

    initializeBoard();

    return () => {
      cancelled = true;
    };
  }, [boardId, isLoaded, isSignedIn, getToken]);

  if (loading) {
    return <BoardLoading />;
  }

  if (error || !board) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold">Unable to load board</h1>

            <p className="mt-2 text-sm text-destructive">
              {error || "Board not found."}
            </p>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  const canEdit =
    yourRole === "OWNER" || yourRole === "ADMIN" || yourRole === "EDITOR";

  const canDeletePage =
    (yourRole === "OWNER" || yourRole === "ADMIN") && pages.length > 1;

  const canCreatePage = board?.type === "SLIDES" && canEdit;

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background">
      <BoardHeader board={board} />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <BoardSidebar
          board={board}
          pages={pages}
          selectedPageId={selectedPageId}
          canCreatePage={canCreatePage}
          canEditPage={canEdit}
          canDeletePage={canDeletePage}
          onSelectPage={handleSelectPage}
          // onCreatePage={handleCreatePage}
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

        <section className="min-h-0 min-w-0 flex-1 overflow-hidden">
          <CanvasWorkspace
            board={board}
            currentPage={currentPage}
            canEdit={canEdit}
          />
        </section>
      </div>

      {/* Create Page Modal */}
      <CreatePageModal
        open={showCreatePage}
        title={newPageTitle}
        loading={pageLoading}
        error={createPageError}
        onTitleChange={setNewPageTitle}
        onClose={() => {
          if (pageLoading) return;

          setShowCreatePage(false);
          setCreatePageError(null);
        }}
        onSubmit={handleCreatePage}
      />
      {/* Rename Page Modal */}
      <EditPageModal
        open={showEditPage}
        title={pageTitle}
        loading={pageLoading}
        error={pageError}
        onTitleChange={setPageTitle}
        onClose={() => {
          if (pageLoading) return;

          setShowEditPage(false);
          setPageError(null);
        }}
        onSubmit={handleUpdatePage}
      />

      {/* Delete Page Confirmation */}
      <DeletePageDialog
        open={deletePageId !== null}
        loading={pageLoading}
        onClose={() => {
          if (pageLoading) return;

          setDeletePageId(null);
          setPageError(null);
        }}
        onConfirm={handleDeletePage}
      />
    </main>
  );
}

function BoardLoading() {
  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <div className="h-16 animate-pulse border-b bg-muted/30" />

      <div className="flex flex-1">
        <div className="w-64 animate-pulse border-r bg-muted/20" />

        <div className="flex-1 animate-pulse bg-muted/10" />
      </div>
    </main>
  );
}
