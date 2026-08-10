export type RoomRole =
  | "OWNER"
  | "ADMIN"
  | "EDITOR"
  | "VIEWER";

export type Room = {
  id: string;
  name: string;
  slug: string;
  roomCode: string;

  description: string | null;
  thumbnail: string | null;

  visibility: string;

  isSessionActive: boolean;

  owner: {
    id: string;
    displayName: string;
    imageUrl: string | null;
  };

  yourRole: RoomRole;

  memberCount: number;

  createdAt: string;
  updatedAt: string;
};

// src/types/room.ts

// export type RoomRole = "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";

export type BoardType = "INFINITE" | "SLIDES";

export type RoomMember = {
  memberId: string;
  role: RoomRole;
  joinedAt: string;
  user: {
    id: string;
    displayName: string;
    username?: string | null;
    imageUrl?: string | null;
  };
};

export type RoomBoard = {
  id: string;
  name: string;
  description?: string | null;
  type: BoardType;
  settings: Record<string, unknown>;
  pageCount: number;

  createdBy: {
    id: string;
    displayName: string;
    imageUrl?: string | null;
  };

  createdAt: string;
  updatedAt: string;
};

export type RoomDetails = {
  id: string;
  name: string;
  slug: string;
  roomCode: string;

  description?: string | null;
  thumbnail?: string | null;

  visibility: "PUBLIC" | "PRIVATE";

  isSessionActive: boolean;

  owner: {
    id: string;
    displayName: string;
    imageUrl?: string | null;
  };

  yourRole: RoomRole;

  memberCount: number;

  members: RoomMember[];

  boards: RoomBoard[];

  createdAt: string;
  updatedAt: string;
};