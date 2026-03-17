import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "border border-sky-300/60 bg-[linear-gradient(135deg,#6ac2ff,#3b82f6)] text-white shadow-[0_10px_30px_rgba(59,130,246,0.28)] hover:brightness-105",
  secondary:
    "border border-sky-200/70 bg-white/80 text-slate-700 hover:border-sky-300/70 hover:bg-sky-100/70",
  danger:
    "border border-rose-300/60 bg-rose-100/70 text-rose-700 hover:bg-rose-200/70",
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-55",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      {...props}
    />
  );
});
