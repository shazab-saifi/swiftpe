"use client";

import { useEffect, useState } from "react";

type DashboardUser = {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
};

const SEARCH_DEBOUNCE_MS = 400;

export function UsersSection() {
  const [users, setUsers] = useState<DashboardUser[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchValue]);

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("filter", debouncedSearchValue);

        const response = await fetch(
          `http://localhost:4000/api/v1/user/bulk?${params.toString()}`,
          { signal: controller.signal }
        );
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            typeof data?.error === "string"
              ? data.error
              : "Could not load users. Please refresh and try again."
          );
        }

        setUsers(Array.isArray(data?.user) ? data.user : []);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Could not load users. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();

    return () => {
      controller.abort();
    };
  }, [debouncedSearchValue]);

  return (
    <section className="rounded-3xl border border-black/8 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight text-balance text-slate-950">
            All Users
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Search and review users currently stored in the database.
          </p>
        </div>
        <p className="text-sm font-medium text-slate-500">
          {users.length} users
        </p>
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-medium text-slate-700">Search users</span>
        <input
          type="search"
          value={searchValue}
          onChange={(event) => {
            setSearchValue(event.target.value);
          }}
          placeholder="Search by first or last name"
          className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 text-sm text-slate-950 transition-colors outline-none placeholder:text-slate-400 focus:border-slate-400"
        />
      </label>

      <div aria-live="polite" className="mt-6">
        {isLoading ? <p className="text-sm text-slate-600">Loading…</p> : null}
        {error ? (
          <p className="text-sm wrap-break-word text-rose-600">{error}</p>
        ) : null}
      </div>

      {!isLoading && !error ? (
        users.length > 0 ? (
          <div className="mt-6 grid gap-3">
            {users.map((user) => (
              <article
                key={user._id ?? user.username}
                className="rounded-3xl border border-black/8 bg-slate-50 p-4"
              >
                <h3 className="text-base font-semibold wrap-break-word text-slate-950">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="mt-1 text-sm wrap-break-word text-slate-600">
                  {user.username}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-600">
            No users matched your search.
          </p>
        )
      ) : null}
    </section>
  );
}
