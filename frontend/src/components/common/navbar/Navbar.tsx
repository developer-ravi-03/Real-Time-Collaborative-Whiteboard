"use client";

import { useEffect, useState } from "react";

import Logo from "./Logo";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-full px-8">
        <div
          className={`
            flex
            h-[84px]
            items-center
            justify-between
            rounded-2xl
            border
            px-7
            transition-all
            duration-300

            ${
              scrolled
                ? "border-border/70 bg-background/80 backdrop-blur-2xl shadow-xl"
                : "border-border/40 bg-background/60 backdrop-blur-xl"
            }
          `}
        >
          {/* Logo */}

          <div className="pl-1 sm:pl-2">
            <Logo />
          </div>

          {/* Desktop Navigation */}

          <div className="hidden lg:block">
            <NavLinks />
          </div>

          {/* Right Side */}

          <div className="flex items-center gap-4 pr-1 sm:pr-2">
            <NavActions />

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
