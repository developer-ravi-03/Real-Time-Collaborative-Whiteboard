"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  saveCanvas,
  type GetToken,
} from "@/lib/api-client";

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

  onSaved?: (page: {
    version: number;
    updatedAt: string;
  }) => void;
};

export function useCanvasPersistence({
  pageId,
  getToken,
  debounceMs = 1800,
  enabled = true,
  onSaved,
}: UseCanvasPersistenceOptions) {
  /*
   * ==========================================================
   * UI STATE
   * ==========================================================
   */

  const [status, setStatus] = useState<CanvasSaveStatus>(
    pageId ? "saved" : "idle",
  );

  const [isDirty, setIsDirty] = useState(false);

  /*
   * ==========================================================
   * PAGE REFERENCE
   * ==========================================================
   */

  const activePageIdRef = useRef<string | null>(pageId);

  /*
   * ==========================================================
   * PENDING SAVE
   * ==========================================================
   *
   * These refs always contain the latest canvas snapshot that
   * still needs to be persisted.
   */

  const pendingPageIdRef =
    useRef<string | null>(null);

  const pendingCanvasDataRef =
    useRef<Record<string, unknown> | null>(null);

  /*
   * Every canvas mutation gets a new version.
   *
   * This prevents an older request from incorrectly marking
   * newer unsaved changes as saved.
   */

  const changeVersionRef = useRef(0);

  /*
   * ==========================================================
   * SAVE CONTROL
   * ==========================================================
   */

  const saveInProgressRef = useRef(false);

  const saveQueuedRef = useRef(false);

  const debounceTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * ==========================================================
   * CLEAR DEBOUNCE TIMER
   * ==========================================================
   */

  const clearDebounceTimer = useCallback(() => {
    if (!debounceTimerRef.current) {
      return;
    }

    clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = null;
  }, []);

  /*
   * ==========================================================
   * PERFORM SAVE
   * ==========================================================
   *
   * targetPageId + targetCanvasData are intentionally passed
   * as snapshots.
   *
   * This is important when:
   *
   *     Page A is saving
   *          ↓
   *     user switches to Page B
   *          ↓
   *     Page B starts changing
   *
   * Page A must never accidentally receive Page B's data.
   */

  const performSave = useCallback(
    async (
      targetPageId?: string | null,
      targetCanvasData?: Record<string, unknown> | null,
      targetVersion?: number,
    ) => {
      if (!enabled) {
        return;
      }

      const pageIdToSave =
        targetPageId ??
        pendingPageIdRef.current;

      const canvasDataToSave =
        targetCanvasData ??
        pendingCanvasDataRef.current;

      const versionToSave =
        targetVersion ??
        changeVersionRef.current;

      if (
        !pageIdToSave ||
        !canvasDataToSave
      ) {
        return;
      }

      /*
       * Another save is already running.
       *
       * The latest pending snapshot will be saved after
       * the current request finishes.
       */

      if (saveInProgressRef.current) {
        saveQueuedRef.current = true;

        return;
      }

      saveInProgressRef.current = true;

      saveQueuedRef.current = false;

      setStatus("saving");

      try {
        const response = await saveCanvas(
          getToken,
          pageIdToSave,
          canvasDataToSave,
        );

        /*
         * Only clear dirty state if this request represents
         * the latest change for the same page.
         */

        const isLatestChange =
          changeVersionRef.current ===
            versionToSave &&
          pendingPageIdRef.current ===
            pageIdToSave;

        const isCurrentPage =
          activePageIdRef.current ===
          pageIdToSave;

        if (isLatestChange) {
          pendingPageIdRef.current = null;

          pendingCanvasDataRef.current = null;

          setIsDirty(false);
        }

        /*
         * Do not let a save belonging to an old page modify
         * the status of the currently visible page.
         */

        if (
          isLatestChange &&
          isCurrentPage
        ) {
          setStatus("saved");
        }

        onSaved?.({
          version: response.data.version,
          updatedAt: response.data.updatedAt,
        });
      } catch (error) {
        console.error(
          "Failed to save canvas:",
          error,
        );

        /*
         * Only show the error if this request is still
         * relevant to the current pending change.
         */

        const isLatestChange =
          changeVersionRef.current ===
            versionToSave &&
          pendingPageIdRef.current ===
            pageIdToSave;

        const isCurrentPage =
          activePageIdRef.current ===
          pageIdToSave;

        if (
          isLatestChange &&
          isCurrentPage
        ) {
          setStatus("error");

          setIsDirty(true);
        }
      } finally {
        saveInProgressRef.current = false;

        /*
         * If another canvas mutation happened while the
         * request was running, immediately save the latest
         * snapshot.
         */

        const hasPendingChanges =
          pendingPageIdRef.current !== null &&
          pendingCanvasDataRef.current !== null;

        if (
          saveQueuedRef.current ||
          hasPendingChanges
        ) {
          saveQueuedRef.current = false;

          if (hasPendingChanges) {
            void performSave(
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
   * ==========================================================
   * MARK DIRTY
   * ==========================================================
   */

  const markDirty = useCallback(
    (
      canvasData: Record<string, unknown>,
    ) => {
      if (!enabled || !pageId) {
        return;
      }

      /*
       * Every mutation gets a new version.
       */

      changeVersionRef.current += 1;

      pendingPageIdRef.current = pageId;

      pendingCanvasDataRef.current =
        canvasData;

      setIsDirty(true);

      setStatus("unsaved");

      clearDebounceTimer();

      debounceTimerRef.current =
        setTimeout(() => {
          debounceTimerRef.current = null;

          void performSave(
            pageId,
            canvasData,
            changeVersionRef.current,
          );
        }, debounceMs);
    },
    [
      clearDebounceTimer,
      debounceMs,
      enabled,
      pageId,
      performSave,
    ],
  );

  /*
   * ==========================================================
   * FLUSH
   * ==========================================================
   *
   * Immediately saves the latest pending canvas.
   */

  const flush = useCallback(async () => {
    clearDebounceTimer();

    const pendingPageId =
      pendingPageIdRef.current;

    const pendingCanvasData =
      pendingCanvasDataRef.current;

    const pendingVersion =
      changeVersionRef.current;

    if (
      !pendingPageId ||
      !pendingCanvasData
    ) {
      return;
    }

    await performSave(
      pendingPageId,
      pendingCanvasData,
      pendingVersion,
    );
  }, [
    clearDebounceTimer,
    performSave,
  ]);

  /*
   * ==========================================================
   * SAVE NOW
   * ==========================================================
   *
   * Used by Ctrl/Cmd + S.
   */

  const saveNow = useCallback(
    async (
      canvasData?: Record<string, unknown>,
    ) => {
      if (
        canvasData &&
        pageId &&
        enabled
      ) {
        changeVersionRef.current += 1;

        pendingPageIdRef.current =
          pageId;

        pendingCanvasDataRef.current =
          canvasData;

        setIsDirty(true);

        setStatus("unsaved");
      }

      await flush();
    },
    [
      enabled,
      flush,
      pageId,
    ],
  );

  /*
   * ==========================================================
   * PAGE CHANGE
   * ==========================================================
   *
   * Important:
   *
   * Before switching pages, capture the old page's pending
   * data and save it using the OLD page ID.
   */

  useEffect(() => {
    const previousPageId =
      activePageIdRef.current;

    if (
      previousPageId === pageId
    ) {
      return;
    }

    clearDebounceTimer();

    /*
     * Capture old page snapshot before changing the active
     * page reference.
     */

    const oldPageId =
      pendingPageIdRef.current;

    const oldCanvasData =
      pendingCanvasDataRef.current;

    const oldVersion =
      changeVersionRef.current;

    if (
      previousPageId &&
      oldPageId === previousPageId &&
      oldCanvasData
    ) {
      /*
       * Invalidate the old pending state from the current
       * page's point of view.
       *
       * The actual request still receives the old snapshot.
       */

      pendingPageIdRef.current = null;

      pendingCanvasDataRef.current = null;

      setIsDirty(false);

      void performSave(
        previousPageId,
        oldCanvasData,
        oldVersion,
      );
    } else {
      pendingPageIdRef.current = null;

      pendingCanvasDataRef.current = null;

      setIsDirty(false);
    }

    /*
     * Now switch the active page.
     */

    activePageIdRef.current = pageId;

    /*
     * A newly loaded page is already persisted.
     *
     * Therefore NEVER show "Unsaved changes" merely because
     * the page was opened.
     */

    setStatus(
      pageId ? "saved" : "idle",
    );
  }, [
    clearDebounceTimer,
    pageId,
    performSave,
  ]);

  /*
   * ==========================================================
   * CTRL/CMD + S
   * ==========================================================
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      const target =
        event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (
        !event.ctrlKey &&
        !event.metaKey
      ) {
        return;
      }

      if (
        event.key.toLowerCase() !== "s"
      ) {
        return;
      }

      event.preventDefault();

      void saveNow();
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [saveNow]);

  /*
   * ==========================================================
   * CLEANUP
   * ==========================================================
   */

  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, [clearDebounceTimer]);

  /*
   * ==========================================================
   * RETURN
   * ==========================================================
   */

  return {
    status,

    isDirty,

    markDirty,

    saveNow,

    flush,
  };
}