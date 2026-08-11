export type BoardType = "INFINITE" | "SLIDES";

import type { RoomRole } from "./room";

export type Board = {
  id: string;
  roomId: string;
  name: string;
  description?: string | null;
  type: BoardType;
  settings: Record<string, unknown>;
  createdBy: {
    id: string;
    displayName: string;
    imageUrl?: string | null;
  };
  pageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type BoardPage = {
  id: string;
  pageNumber: number;
  title: string | null;
  version: number;
  thumbnailUrl?: string | null;
  updatedAt?: string;
};

export type CurrentPage = BoardPage & {
  canvasData: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};


export type BoardInitialization = {
  board: Board;

  yourRole: RoomRole;

  pages: BoardPage[];

  currentPage: CurrentPage | null;
};