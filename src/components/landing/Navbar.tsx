"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "پلتفرم‌ها", href: "#platforms" },
    { label: "پلاگین‌ها", href: "#plugins" },
    { label: "نظرات", href: "#testimonials" },
    { label: "سوالات", href: "#faq" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-1 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-calm-green transition-colors hover:text-dark-green">
              دسک‌شاپ
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-gray transition-colors hover:text-calm-green"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              className="rounded-[10px] bg-calm-green px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-dark-green hover:shadow-card"
            >
              شروع رایگان
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-neutral-gray hover:bg-warm-white md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-3 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-neutral-gray transition-colors hover:text-calm-green"
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/login"
                className="mt-2 rounded-[10px] bg-calm-green px-6 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-dark-green"
              >
                شروع رایگان
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
