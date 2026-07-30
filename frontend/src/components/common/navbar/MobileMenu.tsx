"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import ThemeToggle from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { navItems } from "./nav-items";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-lg lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-screen w-80 max-w-[85vw] border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <span className="text-lg font-semibold tracking-tight">
            Sync<span className="font-normal text-muted-foreground">Board</span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="rounded-lg px-4 py-3 text-[14.5px] font-medium transition-colors duration-200 hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-border p-5">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Theme
            </span>
            <ThemeToggle />
          </div>

          <div className="space-y-2.5">
            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-lg"
            >
              <Link href="/login" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </Button>
            <Button
              asChild
              variant="brand"
              className="h-10 w-full rounded-full font-semibold"
            >
              <Link href="/register" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
