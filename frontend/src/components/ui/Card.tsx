import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "solid" | "soft";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  interactive?: boolean;
  className?: string;
}

/**
 * Universal clay card. Padded, rounded, glass-clay surface with the
 * 4-layer shadow stack. `interactive` adds hover lift.
 */
export function Card({
  children,
  variant = "default",
  interactive = false,
  className = "",
  ...rest
}: CardProps) {
  const variantClass =
    variant === "solid" ? "clay-card-solid" : variant === "soft" ? "clay-card-soft" : "";
  const interactiveClass = interactive ? "clay-card-interactive" : "";
  return (
    <div
      className={`clay-card ${variantClass} ${interactiveClass} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = "", ...rest }: CardBodyProps) {
  return (
    <div className={`relative z-10 flex flex-col ${className}`} {...rest}>
      {children}
    </div>
  );
}