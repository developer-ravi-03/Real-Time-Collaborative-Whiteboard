"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { saveCanvas, type GetToken } from "@/lib/api-client";

/*
 * ==========================================================
 * TYPES
 * ==========================================================
 */

export type CanvasSaveStatus =
  | "idle"
  | "unsaved"
  | "saving"
  | "saved"
  | "error";

type UseCanvasPersistenceOptions = {
  pageId: string | null;

  getToken: GetToken;

  debounceMs?: number;

  enabled?: boolean;

  onSaved?: (page: { version: number; updatedAt: string }) => void;
};

/*
 * ==========================================================
 * SAVE FUNCTION TYPE
 * ==========================================================
 */

type PerformSave = (
  targetPageId?: string | null,
  targetCanvasData?: Record<string, unknown> | null,
  targetVersion?: number,
) => Promise<void>;

/*
 * ==========================================================
 * HOOK
 * ==========================================================
 */

export function useCanvasPersistence({
  pageId,
  getToken,
  debounceMs = 1800,
  enabled = true,
  onSaved,
}: UseCanvasPersistenceOptions) {
  /*
   * ========================================================
   * UI STATE
   * ========================================================
   */

  const [status, setStatus] = useState<CanvasSaveStatus>(
    pageId ? "saved" : "idle",
  );

  const [isDirty, setIsDirty] = useState(false);

  /*
   * ========================================================
   * PAGE REFERENCE
   * ========================================================
   *
   * This tracks which page is currently active.
   *
   * It is intentionally a ref because changing the active
   * page must not itself cause another render.
   */

  const activePageIdRef = useRef<string | null>(pageId);

  /*
   * ========================================================
   * PENDING SAVE
   * ========================================================
   *
   * These refs contain the latest canvas snapshot that still
   * needs to be persisted.
   */

  const pendingPageIdRef = useRef<string | null>(null);

  const pendingCanvasDataRef = useRef<Record<string, unknown> | null>(null);

  /*
   * ========================================================
   * CHANGE VERSION
   * ========================================================
   *
   * Every canvas mutation gets a new version.
   *
   * This prevents an older save request from marking newer
   * changes as saved.
   */

  const changeVersionRef = useRef(0);

  /*
   * ========================================================
   * SAVE CONTROL
   * ========================================================
   */

  const saveInProgressRef = useRef(false);

  const saveQueuedRef = useRef(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * ========================================================
   * PERFORM SAVE REF
   * ========================================================
   *
   * We keep the latest performSave function in a ref so that
   * performSave can trigger another save after a previous
   * request completes without recursively referencing itself
   * inside useCallback.
   *
   * This also keeps React Compiler happy.
   */

  const performSaveRef = useRef<PerformSave | null>(null);

  /*
   * ========================================================
   * CLEAR DEBOUNCE TIMER
   * ========================================================
   */

  const clearDebounceTimer = useCallback(() => {
    const timer = debounceTimerRef.current;

    if (timer === null) {
      return;
    }

    clearTimeout(timer);

    debounceTimerRef.current = null;
  }, []);

  /*
   * ========================================================
   * PERFORM SAVE
   * ========================================================
   *
   * Responsibilities:
   *
   * 1. Persist the requested snapshot.
   * 2. Protect newer changes from older requests.
   * 3. Queue a latest save if a mutation occurs while the
   *    current request is still running.
   */

  const performSave = useCallback<PerformSave>(
    async (targetPageId, targetCanvasData, targetVersion) => {
      /*
       * ------------------------------------------------------
       * Persistence disabled
       * ------------------------------------------------------
       */

      if (!enabled) {
        return;
      }

      /*
       * ------------------------------------------------------
       * Resolve save snapshot
       * ------------------------------------------------------
       */

      const pageIdToSave = targetPageId ?? pendingPageIdRef.current;

      const canvasDataToSave = targetCanvasData ?? pendingCanvasDataRef.current;

      const versionToSave = targetVersion ?? changeVersionRef.current;

      /*
       * ------------------------------------------------------
       * Nothing to save
       * ------------------------------------------------------
       */

      if (!pageIdToSave || !canvasDataToSave) {
        return;
      }

      /*
       * ------------------------------------------------------
       * Existing save in progress
       * ------------------------------------------------------
       *
       * Do not start multiple requests simultaneously.
       *
       * The latest pending snapshot will be picked up after
       * the current request finishes.
       */

      if (saveInProgressRef.current) {
        saveQueuedRef.current = true;

        return;
      }

      /*
       * ------------------------------------------------------
       * Start save
       * ------------------------------------------------------
       */

      saveInProgressRef.current = true;

      saveQueuedRef.current = false;

      /*
       * We only show "saving" when this page is still the
       * active page.
       */

      if (activePageIdRef.current === pageIdToSave) {
        setStatus("saving");
      }

      try {
        /*
         * ----------------------------------------------------
         * REST API
         * ----------------------------------------------------
         */

        const response = await saveCanvas(
          getToken,
          pageIdToSave,
          canvasDataToSave,
        );

        /*
         * ----------------------------------------------------
         * Check whether this request is still latest
         * ----------------------------------------------------
         */

        const isLatestChange =
          changeVersionRef.current === versionToSave &&
          pendingPageIdRef.current === pageIdToSave;

        const isCurrentPage = activePageIdRef.current === pageIdToSave;

        /*
         * ----------------------------------------------------
         * Clear pending snapshot only when this request
         * represents the latest change.
         * ----------------------------------------------------
         */

        if (isLatestChange) {
          pendingPageIdRef.current = null;

          pendingCanvasDataRef.current = null;

          if (isCurrentPage) {
            setIsDirty(false);
          }
        }

        /*
         * ----------------------------------------------------
         * Update UI status only for current page.
         * ----------------------------------------------------
         */

        if (isLatestChange && isCurrentPage) {
          setStatus("saved");
        }

        /*
         * ----------------------------------------------------
         * Notify parent about successful save.
         * ----------------------------------------------------
         */

        onSaved?.({
          version: response.data.version,
          updatedAt: response.data.updatedAt,
        });
      } catch (error) {
        console.error("Failed to save canvas:", error);

        /*
         * ----------------------------------------------------
         * Check whether this failed request is still relevant.
         * ----------------------------------------------------
         */

        const isLatestChange =
          changeVersionRef.current === versionToSave &&
          pendingPageIdRef.current === pageIdToSave;

        const isCurrentPage = activePageIdRef.current === pageIdToSave;

        /*
         * ----------------------------------------------------
         * Only show error for the currently active page and
         * latest pending change.
         * ----------------------------------------------------
         */

        if (isLatestChange && isCurrentPage) {
          setStatus("error");

          setIsDirty(true);
        }
      } finally {
        /*
         * ----------------------------------------------------
         * Current request finished.
         * ----------------------------------------------------
         */

        saveInProgressRef.current = false;

        /*
         * ----------------------------------------------------
         * Check whether another change arrived while saving.
         * ----------------------------------------------------
         */

        const hasPendingChanges =
          pendingPageIdRef.current !== null &&
          pendingCanvasDataRef.current !== null;

        if (saveQueuedRef.current || hasPendingChanges) {
          saveQueuedRef.current = false;

          /*
           * Use the latest function from the ref.
           *
           * This avoids recursive performSave references.
           */

          const latestPerformSave = performSaveRef.current;

          if (latestPerformSave && hasPendingChanges) {
            void latestPerformSave(
              pendingPageIdRef.current,
              pendingCanvasDataRef.current,
              changeVersionRef.current,
            );
          }
        }
      }
    },
    [enabled, getToken, onSaved],
  );

  /*
   * ========================================================
   * KEEP PERFORM SAVE REF IN SYNC
   * ========================================================
   */

  useEffect(() => {
    performSaveRef.current = performSave;

    return () => {
      if (performSaveRef.current === performSave) {
        performSaveRef.current = null;
      }
    };
  }, [performSave]);

  /*
   * ========================================================
   * MARK DIRTY
   * ========================================================
   *
   * Called whenever the canvas changes.
   *
   * It does NOT immediately hit the database.
   *
   * Instead:
   *
   *     canvas change
   *          ↓
   *     pending snapshot
   *          ↓
   *     debounce
   *          ↓
   *     REST save
   */

  const markDirty = useCallback(
    (canvasData: Record<string, unknown>) => {
      /*
       * ------------------------------------------------------
       * Guard
       * ------------------------------------------------------
       */

      if (!enabled || !pageId) {
        return;
      }

      /*
       * ------------------------------------------------------
       * New canvas mutation
       * ------------------------------------------------------
       */

      changeVersionRef.current += 1;

      const version = changeVersionRef.current;

      /*
       * ------------------------------------------------------
       * Store latest snapshot
       * ------------------------------------------------------
       */

      pendingPageIdRef.current = pageId;

      pendingCanvasDataRef.current = canvasData;

      /*
       * ------------------------------------------------------
       * UI
       * ------------------------------------------------------
       */

      setIsDirty(true);

      setStatus("unsaved");

      /*
       * ------------------------------------------------------
       * Reset debounce timer
       * ------------------------------------------------------
       */

      clearDebounceTimer();

      /*
       * ------------------------------------------------------
       * Schedule save
       * ------------------------------------------------------
       */

      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;

        const latestPerformSave = performSaveRef.current;

        if (!latestPerformSave) {
          return;
        }

        void latestPerformSave(pageId, canvasData, version);
      }, debounceMs);
    },
    [clearDebounceTimer, debounceMs, enabled, pageId],
  );

  /*
   * ========================================================
   * FLUSH
   * ========================================================
   *
   * Immediately saves the latest pending snapshot.
   */

  const flush = useCallback(async () => {
    clearDebounceTimer();

    const pendingPageId = pendingPageIdRef.current;

    const pendingCanvasData = pendingCanvasDataRef.current;

    const pendingVersion = changeVersionRef.current;

    /*
     * ------------------------------------------------------
     * Nothing pending
     * ------------------------------------------------------
     */

    if (!pendingPageId || !pendingCanvasData) {
      return;
    }

    /*
     * ------------------------------------------------------
     * Use latest save function
     * ------------------------------------------------------
     */

    const latestPerformSave = performSaveRef.current;

    if (!latestPerformSave) {
      return;
    }

    await latestPerformSave(pendingPageId, pendingCanvasData, pendingVersion);
  }, [clearDebounceTimer]);

  /*
   * ========================================================
   * SAVE NOW
   * ========================================================
   *
   * Used by:
   *
   *     Ctrl + S
   *     Cmd + S
   *
   * It can optionally receive a fresh canvas snapshot.
   */

  const saveNow = useCallback(
    async (canvasData?: Record<string, unknown>) => {
      /*
       * ------------------------------------------------------
       * If a snapshot was explicitly provided, make it the
       * latest pending change before flushing.
       * ------------------------------------------------------
       */

      if (canvasData && pageId && enabled) {
        changeVersionRef.current += 1;

        pendingPageIdRef.current = pageId;

        pendingCanvasDataRef.current = canvasData;

        setIsDirty(true);

        setStatus("unsaved");
      }

      /*
       * ------------------------------------------------------
       * Immediately persist pending snapshot.
       * ------------------------------------------------------
       */

      await flush();
    },
    [enabled, flush, pageId],
  );

  /*
   * ========================================================
   * PAGE CHANGE
   * ========================================================
   *
   * Scenario:
   *
   *     Page A
   *       ↓
   *     user draws
   *       ↓
   *     Page A has pending data
   *       ↓
   *     user switches to Page B
   *
   * We MUST save Page A using:
   *
   *     Page A ID
   *     Page A canvas data
   *
   * before treating Page B as active.
   */

  useEffect(() => {
    const previousPageId = activePageIdRef.current;

    /*
     * ------------------------------------------------------
     * Nothing changed
     * ------------------------------------------------------
     */

    if (previousPageId === pageId) {
      return;
    }

    /*
     * ------------------------------------------------------
     * Cancel pending debounce
     * ------------------------------------------------------
     */

    clearDebounceTimer();

    /*
     * ------------------------------------------------------
     * Capture old page snapshot
     * ------------------------------------------------------
     */

    const oldPageId = pendingPageIdRef.current;

    const oldCanvasData = pendingCanvasDataRef.current;

    const oldVersion = changeVersionRef.current;

    /*
     * ------------------------------------------------------
     * Save old page if it has pending changes
     * ------------------------------------------------------
     */

    if (previousPageId && oldPageId === previousPageId && oldCanvasData) {
      /*
       * Remove it from the global pending queue first.
       *
       * The request below receives its own immutable
       * references, so it can continue safely.
       */

      pendingPageIdRef.current = null;

      pendingCanvasDataRef.current = null;

      /*
       * The old page is no longer the active page.
       */

      setIsDirty(false);

      /*
       * Save the old page snapshot.
       */

      const latestPerformSave = performSaveRef.current;

      if (latestPerformSave) {
        void latestPerformSave(previousPageId, oldCanvasData, oldVersion);
      }
    } else {
      /*
       * No pending changes for previous page.
       */

      pendingPageIdRef.current = null;

      pendingCanvasDataRef.current = null;

      setIsDirty(false);
    }

    /*
     * ------------------------------------------------------
     * Switch active page reference
     * ------------------------------------------------------
     */

    activePageIdRef.current = pageId;

    /*
     * ------------------------------------------------------
     * New page is already persisted on the server.
     * ------------------------------------------------------
     */

    setStatus(pageId ? "saved" : "idle");
  }, [clearDebounceTimer, pageId]);

  /*
   * ========================================================
   * CTRL / CMD + S
   * ========================================================
   */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      /*
       * ------------------------------------------------------
       * Ignore inputs/textareas/contenteditable elements.
       * ------------------------------------------------------
       */

      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      /*
       * ------------------------------------------------------
       * Detect Ctrl + S / Cmd + S
       * ------------------------------------------------------
       */

      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      if (event.key.toLowerCase() !== "s") {
        return;
      }

      /*
       * ------------------------------------------------------
       * Prevent browser save dialog
       * ------------------------------------------------------
       */

      event.preventDefault();

      void saveNow();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [saveNow]);

  /*
   * ========================================================
   * CLEANUP
   * ========================================================
   */

  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, [clearDebounceTimer]);

  /*
   * ========================================================
   * RETURN
   * ========================================================
   */

  return {
    status,

    isDirty,

    markDirty,

    saveNow,

    flush,
  };
}
