"use client";

import Link from "next/link";
import { UsersSection } from "../components/users-section";
import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const loadBalance = async (token: string) => {
    setIsDashboardLoading(true);
    setDashboardError(null);

    try {
      const balanceResponse = await fetch(apiUrl("/api/v1/account/balance"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const balanceData = await balanceResponse.json().catch(() => null);

      if (!balanceResponse.ok) {
        throw new Error(
          typeof balanceData?.error === "string"
            ? balanceData.error
            : "Could not load your balance. Please refresh and try again."
        );
      }

      setBalance(
        typeof balanceData?.balance === "number" ? balanceData.balance : null
      );
    } catch (error) {
      setDashboardError(
        error instanceof Error
          ? error.message
          : "Could not load the dashboard. Please try again."
      );
    } finally {
      setIsDashboardLoading(false);
    }
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setIsSignedIn(Boolean(token));
    setIsHydrated(true);

    if (!token) {
      return;
    }

    void loadBalance(token);
  }, []);

  const handleSignOut = () => {
    window.localStorage.removeItem("token");
    setIsSignedIn(false);
    setBalance(null);
    setDashboardError(null);
  };

  const formattedBalance =
    typeof balance === "number"
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(balance)
      : "Unavailable";

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

          <section className="flex flex-1 py-10">
            {isSignedIn ? (
              <div className="w-full space-y-8">
                <div className="space-y-4">
                  <p className="text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase">
                    Dashboard
                  </p>
                  <h1 className="text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl">
                    Track your balance and review all users.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                    Your account summary and the current user list are available
                    below.
                  </p>
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                  <section className="h-fit rounded-3xl border border-black/8 bg-white p-6">
                    <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase">
                      Current Balance
                    </p>
                    <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                      {formattedBalance}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      This is the latest available balance from your account.
                    </p>
                    <div aria-live="polite" className="mt-4">
                      {isDashboardLoading ? (
                        <p className="text-sm text-slate-600">Loading…</p>
                      ) : null}
                      {dashboardError ? (
                        <p className="text-sm wrap-break-word text-rose-600">
                          {dashboardError}
                        </p>
                      ) : null}
                    </div>
                  </section>

                  <UsersSection
                    onTransferSuccess={async () => {
                      const token = window.localStorage.getItem("token");

                      if (!token) {
                        return;
                      }

                      await loadBalance(token);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-3xl space-y-6">
                <p className="text-sm font-semibold tracking-[0.24em] text-slate-500 uppercase">
                  Payments Dashboard
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-balance text-slate-950 sm:text-5xl">
                  Move money faster with a clean account workspace.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Sign up to create your account, manage balances, and send
                  money from one place. Sign in if you already have access.
                </p>
                <div className="grid gap-4 pt-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-black/8 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-950">
                      Fast Onboarding
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Create an account in minutes and start using the
                      dashboard.
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
            )}
          </section>
        </div>
      </main>
    </>
  );
}
