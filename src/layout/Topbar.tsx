export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <div>
        <p className="text-xs uppercase text-slate-400">Environment</p>
        <p className="text-sm font-medium">Production-like / Dark Theme</p>
      </div>
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Quick search..."
          className="rounded-md border border-border bg-panel px-3 py-2 text-sm placeholder:text-slate-500"
        />
        <p className="text-sm text-slate-300">{new Date().toLocaleDateString()}</p>
        <div className="h-8 w-8 rounded-full bg-sky-600/40" />
      </div>
    </header>
  );
}
