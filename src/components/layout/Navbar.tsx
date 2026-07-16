"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[var(--color-sand)]/95 backdrop-blur-sm border-b border-[var(--color-sand-dark)]/80 ${
        isScrolled ? "shadow-[var(--shadow-soft)]" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu (mobile) + Logo */}
          <div className="flex items-center gap-3">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 hover:bg-[var(--color-sand-dark)]/50 rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 text-[var(--color-ink)]" />
              </button>
            )}
            
            <a
              href="/"
              className="flex flex-col items-start cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded"
            >
              <span
                className="text-xl font-semibold text-[var(--color-ink)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                BrandName
              </span>
              <span className="w-full h-0.5 bg-[var(--color-gold)] mt-0.5" />
            </a>
          </div>

          {/* Right: Beta pill */}
          <span
            className="px-3 py-1 text-xs font-medium text-[var(--color-gold)] border border-[var(--color-gold)] rounded-full tracking-wider"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Beta Version
          </span>
        </div>
      </div>
    </nav>
  );
}
