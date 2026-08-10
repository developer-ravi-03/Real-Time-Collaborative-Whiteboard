export type BoardType = "INFINITE" | "SLIDES";

export type Board = {
  id: string;
  name: string;
  description: string | null;
  type: BoardType;

  settings: Record<string, unknown>;

  pageCount: number;

  createdBy: {
    id: string;
    displayName: string;
    imageUrl: string | null;
  };

  createdAt: string;
  updatedAt: string;
};