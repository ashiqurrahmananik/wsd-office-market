"use client";

import { useState } from "react";
import Link from "next/link";

type NavLink = { href: string; label: string };

export function MobileNav({
  links,
  user,
  displayName,
}: {
  links: NavLink[];
  user: boolean;
  displayName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-2xl font-black text-orange-600"
      >
        {open ? "×" : "☰"}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b border-orange-100 bg-white p-4 shadow-xl">
          <div className="mx-auto max-w-6xl">
            {user && (
              <div className="mb-3 rounded-2xl bg-orange-50 p-4">
                <div className="text-xs font-bold text-orange-600">SIGNED IN AS</div>
                <div className="mt-1 truncate font-black">{displayName}</div>
              </div>
            )}

            <nav className="grid gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 font-bold hover:bg-orange-50 hover:text-orange-600"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-3 border-t border-stone-100 pt-3">
              {user ? (
                <form action="/auth/signout" method="post">
                  <button className="w-full rounded-xl px-4 py-3 text-left font-bold text-red-600 hover:bg-red-50">
                    🚪 Sign Out
                  </button>
                </form>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="btn btn-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
