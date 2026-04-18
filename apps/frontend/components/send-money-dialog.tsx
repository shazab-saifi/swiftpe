"use client";

import { useEffect, useId, useState, type FormEvent } from "react";

type DialogUser = {
  _id?: string;
  username: string;
  firstName: string;
  lastName: string;
};

type SendMoneyDialogProps = {
  isOpen: boolean;
  user: DialogUser | null;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
};

export function SendMoneyDialog({
  isOpen,
  user,
  onClose,
  onSuccess,
}: SendMoneyDialogProps) {
  const amountInputId = useId();
  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setError(null);
      setIsSubmitting(false);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user?._id) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = window.localStorage.getItem("token");
    const parsedAmount = Number(amount);

    if (!token) {
      setError("Sign in again before sending money.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/account/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parsedAmount,
            to: user._id,
          }),
        }
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Could not complete the transfer. Please try again."
        );
      }

      await onSuccess?.();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not complete the transfer. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="send-money-title"
        className="max-h-full w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2
              id="send-money-title"
              className="text-2xl font-semibold tracking-tight text-slate-950"
            >
              Send Money
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Send money to {user.firstName} {user.lastName}.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 text-lg font-medium text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
          >
            ×
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label htmlFor={amountInputId} className="block">
            <span className="text-sm font-medium text-slate-700">Amount</span>
            <input
              id={amountInputId}
              name="amount"
              type="number"
              inputMode="decimal"
              min="1"
              step="1"
              autoComplete="off"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
              }}
              placeholder="Enter amount…"
              className="mt-2 h-12 w-full rounded-2xl border border-black/10 bg-slate-50 px-4 text-sm text-slate-950 transition-colors outline-none placeholder:text-slate-400 focus:border-slate-400"
            />
          </label>

          <div aria-live="polite">
            {error ? (
              <p className="text-sm wrap-break-word text-rose-600">{error}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
