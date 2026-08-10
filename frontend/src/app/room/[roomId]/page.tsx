// src/app/room/[roomId]/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import RoomClient from "./RoomClient";

type RoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const { roomId } = await params;

  return <RoomClient roomId={roomId} />;
}
