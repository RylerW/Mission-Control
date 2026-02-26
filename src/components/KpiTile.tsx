import { Card } from './Card';

interface KpiTileProps {
  label: string;
  value: string;
  helper?: string;
}

export function KpiTile({ label, value, helper }: KpiTileProps) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
    </Card>
  );
}
