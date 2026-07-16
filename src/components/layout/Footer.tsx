"use client";

import { URLs } from "@/config/brand";

const footerLinks = [
  { label: "Privacy Policy", href: URLs.privacy },
  { label: "Data & Consent", href: URLs.dataConsent },
  { label: "Terms", href: URLs.terms },
];

export default function Footer() {
  return (
    <footer className="relative z-40 bg-[var(--color-sand)] py-8 px-4 border-t border-[var(--color-sand-dark)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Links */}
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-stone)] hover:text-[var(--color-ink)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] rounded px-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-sm text-[var(--color-stone)]">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
