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