import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return <DashboardClient />;
}
