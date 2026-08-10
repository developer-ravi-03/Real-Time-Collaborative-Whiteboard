// "use client";

// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// import ThemeToggle from "@/components/common/ThemeToggle";
// import { Button } from "@/components/ui/button";

// export default function NavActions() {
//   return (
//     <div className="hidden items-center gap-8 pr-1 lg:flex">
//       {/* Theme Toggle */}
//       <ThemeToggle />

//       {/* Login */}
//       <Button
//         asChild
//         variant="ghost"
//         className=" h-11 rounded-full px-5 text-[15px] font-medium border border-transparent hover:border-border hover:bg-background hover:shadow-sm transition-all duration-300"
//       >
//         <Link href="/login">Login</Link>
//       </Button>

//       {/* Get Started */}
//       <Button
//         asChild
//         variant="brand"
//         className="group h-13 rounded-full mr-1 bg-[#172033] hover:bg-[#1d2942] border border-white/10 px-8 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.28)] active:scale-[0.98] "
//       >
//         <Link
//           href="/register"
//           className="inline-flex items-center justify-center gap-3"
//         >
//           <span>Get Started</span>

//           <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1" />
//         </Link>
//       </Button>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function NavActions() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) {
    return (
      <div className="flex items-center">
        <ThemeToggle />
      </div>
    );
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isRoom = pathname.startsWith("/room");

  return (
    <div className="flex items-center gap-3">
      {/* Theme */}
      <ThemeToggle />

      {!isSignedIn ? (
        <>
          {/* Login */}
          <Button asChild variant="ghost" className="h-11 rounded-full px-5">
            <Link href="/login">Login</Link>
          </Button>

          {/* Get Started */}
          <Button
            asChild
            variant="brand"
            className="group h-11 rounded-full px-6 font-semibold"
          >
            <Link href="/register" className="inline-flex items-center gap-2">
              <span>Get Started</span>

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </>
      ) : (
        <>
          {/* Landing page */}
          {!isDashboard && !isRoom && (
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full px-6"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {/* Dashboard / Room */}
          {(isDashboard || isRoom) && (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
