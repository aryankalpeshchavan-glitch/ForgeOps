import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "default" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}

const variantClass: Record<Variant, string> = {
  primary: "clay-btn-primary",
  secondary: "clay-btn-secondary",
  outline: "clay-btn-outline",
  ghost: "clay-btn-ghost",
  danger: "clay-btn-danger",
};

const sizeClass: Record<Size, string> = {
  sm: "clay-btn-sm",
  default: "",
  lg: "clay-btn-lg",
};

/**
 * Clay button — convex, squishes on press, lifts on hover.
 * Default min-height 52px (> WCAG 44px touch target).
 */
export function Button({
  children,
  variant = "primary",
  size = "default",
  icon,
  loading = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      type="button"
      className={`clay-btn ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="clay-spinner" aria-hidden="true" /> : icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </button>
  );
}

interface LinkButtonProps extends Omit<LinkProps, "className"> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
}

/** Link styled as a clay button (semantic anchor, not nested in <button>). */
export function LinkButton({
  children,
  variant = "primary",
  size = "default",
  icon,
  className = "",
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      className={`clay-btn ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...rest}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </Link>
  );
}

/** Anchor styled as a clay button for external links. */
export function ExternalButton({
  children,
  variant = "primary",
  size = "default",
  icon,
  className = "",
  href,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`clay-btn ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </a>
  );
}