"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary Navigation"
      className="flex items-center gap-10 xl:gap-12"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group relative overflow-hidden py-2 text-[18px] font-medium tracking-tight transition-colors duration-300",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}

            {/* underline */}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-primary transition-transform duration-300 ease-out",
                isActive && "scale-x-100",
                !isActive && "group-hover:scale-x-100",
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
