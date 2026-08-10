// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import { cn } from "@/lib/utils";
// import { navItems } from "./nav-items";

// export default function NavLinks() {
//   const pathname = usePathname();

//   return (
//     <nav
//       aria-label="Primary Navigation"
//       className="flex items-center gap-10 xl:gap-12"
//     >
//       {navItems.map((item) => {
//         const isActive = pathname === item.href;

//         return (
//           <Link
//             key={item.href}
//             href={item.href}
//             className={cn(
//               "group relative overflow-hidden py-2 text-[18px] font-medium tracking-tight transition-colors duration-300",
//               isActive
//                 ? "text-foreground"
//                 : "text-muted-foreground hover:text-foreground",
//             )}
//           >
//             {item.label}

//             {/* underline */}
//             <span
//               className={cn(
//                 "absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out",
//                 isActive && "scale-x-100",
//                 !isActive && "group-hover:scale-x-100",
//               )}
//             />
//           </Link>
//         );
//       })}
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";

export default function NavLinks() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const isHome = pathname === "/";
  const isDashboard = pathname.startsWith("/dashboard");
  const isRoom = pathname.startsWith("/room");

  return (
    <nav className="flex items-center gap-8">
      {/* Home */}
      <Link
        href="/"
        className={cn(
          "group relative py-2 text-[15px] font-medium transition-colors duration-300",
          isHome
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Home
        <span
          className={cn(
            "absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300",
            isHome && "scale-x-100",
            !isHome && "group-hover:scale-x-100",
          )}
        />
      </Link>

      {/* Boards - only for dashboard/room */}
      {isSignedIn && (isDashboard || isRoom) && (
        <Link
          href="/dashboard"
          className={cn(
            "group relative py-2 text-[15px] font-medium transition-colors duration-300",
            isDashboard
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Boards
          <span
            className={cn(
              "absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300",
              isDashboard && "scale-x-100",
              !isDashboard && "group-hover:scale-x-100",
            )}
          />
        </Link>
      )}
    </nav>
  );
}
