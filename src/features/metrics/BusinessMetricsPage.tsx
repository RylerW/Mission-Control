import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';
import { getBusinessMetrics } from '../../services/mockApi';

export function BusinessMetricsPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getBusinessMetrics>> | null>(null);

  useEffect(() => {
    getBusinessMetrics().then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <SectionHeader title="Business Metrics" description="High-level efficiency and operational outcomes driven by automation." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.cards.map((metric) => (
          <Card key={metric.id}>
            <p className="text-xs text-slate-400">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
            <p className={`text-xs ${metric.trend === 'down' ? 'text-rose-300' : 'text-emerald-300'}`}>{metric.delta}</p>
          </Card>
        ))}
      </div>
      <Card title="Trends over time">
        <div className="h-64">
          <ResponsiveContainer>
            <LineChart data={data.trend}>
              <XAxis dataKey="week" /><YAxis /><Tooltip />
              <Line type="monotone" dataKey="leads" stroke="#38bdf8" />
              <Line type="monotone" dataKey="conversions" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
