import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '../../components/Card';
import { KpiTile } from '../../components/KpiTile';
import { SectionHeader } from '../../components/SectionHeader';
import { getOverviewSnapshot } from '../../services/mockApi';

export function OverviewPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getOverviewSnapshot>> | null>(null);

  useEffect(() => {
    getOverviewSnapshot().then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <SectionHeader title="Overview" description="Live mission snapshot across automations, AI, security and operations." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiTile label="Completed tasks" value={String(data.completedTasks)} helper={`${data.failedTasks} failed`} />
        <KpiTile label="Scheduled tasks" value={String(data.scheduledTasks)} helper="next 24 hours" />
        <KpiTile label="Active agents/bots" value={String(data.activeAgents)} helper="online + degraded" />
        <KpiTile label="Security posture" value={`${data.securityItemsToReview} to review`} helper={`${data.pendingPatches} pending patches`} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Token usage vs baseline">
          <p className="mb-2 text-sm text-slate-300">{data.tokenToday.toLocaleString()} tokens today vs {data.tokenBaseline.toLocaleString()} baseline.</p>
          <div className="h-32">
            <ResponsiveContainer>
              <AreaChart data={data.sparkline.map((v, i) => ({ name: `T${i + 1}`, value: v }))}>
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="#0ea5e933" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Business KPIs">
          <div className="space-y-2 text-sm">
            <p>Revenue: <span className="font-semibold">{data.business.revenue}</span></p>
            <p>Leads: <span className="font-semibold">{data.business.leads}</span></p>
            <p>Conversion: <span className="font-semibold">{data.business.conversion}</span></p>
          </div>
        </Card>
      </div>
    </>
  );
}
