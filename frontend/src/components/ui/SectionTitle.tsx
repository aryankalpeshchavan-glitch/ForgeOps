import type { ReactNode } from "react";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function SectionTitle({ eyebrow, title, description, action }: SectionTitleProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="clay-label mb-1">{eyebrow}</p> : null}
        <h2 className="font-clay text-2xl font-extrabold text-[var(--clay-foreground)] sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-clay-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="font-clay text-3xl font-black tracking-tight text-[var(--clay-foreground)] sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-clay-muted sm:text-lg">
          {subtitle}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </header>
  );
}