import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ title, action, children }: CardProps) {
  return (
    <section className="rounded-xl border border-border bg-panel p-4 shadow-lg shadow-slate-950/20">
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between">
          {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
