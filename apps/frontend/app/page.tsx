"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsSignedIn(Boolean(window.localStorage.getItem("token")));
    setIsHydrated(true);
  }, []);

  const handleSignOut = () => {
    window.localStorage.removeItem("token");
    setIsSignedIn(false);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-2xl focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-slate-950 focus:ring-2 focus:ring-slate-400"
      >
        Skip to content
      </a>

      <main
        id="main-content"
        className="bg-background text-foreground min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col">
          <header className="flex items-start justify-between gap-4 py-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase">
                SwiftPe
              </p>
            </div>

            {isHydrated ? (
              isSignedIn ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm font-medium text-slate-600">
                    Signed In
                  </p>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-black/4 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <nav
                  aria-label="Authentication"
                  className="flex items-center gap-3"
                >
                  <Link
                    href="/signin"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-black/10 px-5 text-sm font-semibold text-slate-900 transition-colors hover:bg-black/4 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
                  >
                    Sign Up
                  </Link>
                </nav>
              )
            ) : null}
          </header>

          <section className="flex flex-1 items-center">
            <div className="max-w-3xl space-y-6">
              <p className="text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase">
                Payments Dashboard
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl">
                Move money faster with a clean account workspace.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Sign up to create your account, manage balances, and send money
                from one place. Sign in if you already have access.
              </p>
              <div className="grid gap-4 pt-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-black/8 bg-white p-5">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Fast Onboarding
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Create an account in minutes and start using the dashboard.
                  </p>
                </div>
                <div className="rounded-3xl border border-black/8 bg-white p-5">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Simple Transfers
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Keep account actions clear with a focused payment flow.
                  </p>
                </div>
                <div className="rounded-3xl border border-black/8 bg-white p-5">
                  <h2 className="text-lg font-semibold text-slate-950">
                    Secure Access
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Store your session token locally after signup or signin.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
