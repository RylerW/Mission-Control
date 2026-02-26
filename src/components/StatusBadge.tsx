interface StatusBadgeProps {
  status: string;
}

const statusColor: Record<string, string> = {
  success: 'bg-emerald-500/20 text-emerald-300',
  online: 'bg-emerald-500/20 text-emerald-300',
  resolved: 'bg-emerald-500/20 text-emerald-300',
  failed: 'bg-rose-500/20 text-rose-300',
  error: 'bg-rose-500/20 text-rose-300',
  critical: 'bg-rose-500/20 text-rose-300',
  queued: 'bg-amber-500/20 text-amber-300',
  'in-progress': 'bg-sky-500/20 text-sky-300',
  'in progress': 'bg-sky-500/20 text-sky-300',
  maintenance: 'bg-violet-500/20 text-violet-300',
  paused: 'bg-slate-500/30 text-slate-300',
  degraded: 'bg-orange-500/20 text-orange-300',
  offline: 'bg-slate-500/30 text-slate-300',
  open: 'bg-rose-500/20 text-rose-300',
  ignored: 'bg-slate-500/30 text-slate-300',
  high: 'bg-orange-500/20 text-orange-300',
  medium: 'bg-amber-500/20 text-amber-300',
  low: 'bg-sky-500/20 text-sky-300'
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colorClass = statusColor[status] ?? 'bg-slate-500/20 text-slate-300';
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${colorClass}`}>
      {status}
    </span>
  );
}
