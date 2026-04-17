"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  CustomInput,
  Field,
  FieldLabel,
  FieldMessage,
  FormCompose,
  FormHeader,
} from "@/components/form-compose";

type SigninFormValues = {
  email: string;
  password: string;
};

export default function SigninPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SigninFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch("http://localhost:4000/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.email,
          password: values.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          typeof data?.error === "string"
            ? data.error
            : "Sign in failed. Check your email & password and try again.";

        setSubmitError(errorMessage);
        return;
      }

      if (typeof data?.token === "string") {
        localStorage.setItem("token", data.token);
      }

      setSubmitSuccess("Signed in successfully.");
      reset();
      router.push("/");
    } catch {
      setSubmitError("Could not connect to the server. Please try again.");
    }
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
        className="bg-background flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-md">
          <FormCompose>
            <FormHeader>
              <h1 className="text-3xl font-semibold tracking-tight text-balance text-slate-950">
                Sign In to SwiftPe
              </h1>
              <p className="text-sm leading-6 text-slate-600">
                Enter your account details to continue.
              </p>
            </FormHeader>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <CustomInput
                  id="email"
                  type="email"
                  placeholder="you@example.com…"
                  autoComplete="email"
                  spellCheck={false}
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email", {
                    required: "Email is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email address.",
                    },
                  })}
                />
                {errors.email ? (
                  <FieldMessage>{errors.email.message}</FieldMessage>
                ) : null}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative rounded-2xl focus-within:ring-4 focus-within:ring-slate-200/60">
                  <CustomInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password…"
                    autoComplete="current-password"
                    aria-invalid={errors.password ? "true" : "false"}
                    className="pr-14"
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters.",
                      },
                      maxLength: {
                        value: 50,
                        message: "Password must be 50 characters or less.",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 rounded-2xl px-1 py-0.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password ? (
                  <FieldMessage>{errors.password.message}</FieldMessage>
                ) : null}
              </Field>

              <div aria-live="polite">
                {submitError ? (
                  <FieldMessage>{submitError}</FieldMessage>
                ) : null}
                {submitSuccess ? (
                  <FieldMessage className="text-emerald-600">
                    {submitSuccess}
                  </FieldMessage>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-4 focus-visible:ring-slate-300 focus-visible:outline-none"
              >
                {isSubmitting ? "Signing In…" : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Need an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-slate-950 underline underline-offset-4"
              >
                Create one
              </Link>
            </p>
          </FormCompose>
        </div>
      </main>
    </>
  );
}
