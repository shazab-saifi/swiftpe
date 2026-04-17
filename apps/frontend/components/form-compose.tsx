import * as React from "react";
import { cn } from "@/lib/utils";

type FormComposeProps = React.ComponentProps<"section">;

export function FormCompose({ className, ...props }: FormComposeProps) {
  return (
    <section
      className={cn(
        "w-full rounded-3xl border border-black/10 bg-white/85 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.4)] backdrop-blur",
        className
      )}
      {...props}
    />
  );
}

type FormHeaderProps = React.ComponentProps<"div">;

export function FormHeader({ className, ...props }: FormHeaderProps) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

type FieldProps = React.ComponentProps<"div">;

export function Field({ className, ...props }: FieldProps) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

type FieldLabelProps = React.ComponentProps<"label">;

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium tracking-tight text-slate-700",
        className
      )}
      {...props}
    />
  );
}

type FieldMessageProps = React.ComponentProps<"p">;

export function FieldMessage({ className, ...props }: FieldMessageProps) {
  return (
    <p
      className={cn("text-xs leading-5 text-rose-600", className)}
      {...props}
    />
  );
}

export const CustomInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full touch-manipulation rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 transition-[background-color,border-color,box-shadow,color] outline-none focus-visible:border-slate-400 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-slate-200/60",
        className
      )}
      {...props}
    />
  );
});

CustomInput.displayName = "CustomInput";
