"use client";

import Link from "next/link";
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
import { apiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";

type SignupFormValues = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export default function SignupPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch(apiUrl("/api/v1/user/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.email,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          password: values.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          typeof data?.error === "string"
            ? data.error
            : "Signup failed. Please check your details and try again.";

        setSubmitError(errorMessage);
        return;
      }

      if (typeof data?.token === "string") {
        localStorage.setItem("token", data.token);
      }

      setSubmitSuccess(data?.msg ?? "Signup successful.");
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
                Join SwiftPe
              </h1>
              <p className="text-sm leading-6 text-slate-600">
                Enter your details below to create a new account.
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

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <CustomInput
                    id="firstName"
                    type="text"
                    placeholder="John…"
                    autoComplete="given-name"
                    aria-invalid={errors.firstName ? "true" : "false"}
                    {...register("firstName", {
                      required: "First name is required.",
                      maxLength: {
                        value: 50,
                        message: "First name must be 50 characters or less.",
                      },
                    })}
                  />
                  {errors.firstName ? (
                    <FieldMessage>{errors.firstName.message}</FieldMessage>
                  ) : null}
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <CustomInput
                    id="lastName"
                    type="text"
                    placeholder="Doe…"
                    autoComplete="family-name"
                    aria-invalid={errors.lastName ? "true" : "false"}
                    {...register("lastName", {
                      required: "Last name is required.",
                      maxLength: {
                        value: 50,
                        message: "Last name must be 50 characters or less.",
                      },
                    })}
                  />
                  {errors.lastName ? (
                    <FieldMessage>{errors.lastName.message}</FieldMessage>
                  ) : null}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative rounded-2xl focus-within:ring-4 focus-within:ring-slate-200/60">
                  <CustomInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters…"
                    autoComplete="new-password"
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
                {isSubmitting ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-semibold text-slate-950 underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </FormCompose>
        </div>
      </main>
    </>
  );
}
