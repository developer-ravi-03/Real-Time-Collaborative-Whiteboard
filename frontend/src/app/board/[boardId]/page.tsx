import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import BoardClient from "./BoardClient";

type BoardPageProps = {
  params: Promise<{
    boardId: string;
  }>;
};

export default async function BoardPage({ params }: BoardPageProps) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const { boardId } = await params;

  return <BoardClient boardId={boardId} />;
}
