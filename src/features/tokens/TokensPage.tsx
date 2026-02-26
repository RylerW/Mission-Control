import { useEffect, useState } from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '../../components/Card';
import { KpiTile } from '../../components/KpiTile';
import { SectionHeader } from '../../components/SectionHeader';
import { getTokenUsage } from '../../services/mockApi';

export function TokensPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getTokenUsage>> | null>(null);

  useEffect(() => {
    getTokenUsage().then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <SectionHeader title="Tokens & Costs" description="Monitor usage, efficiency and spend across AI components." />
      <div className="grid gap-4 md:grid-cols-3">
        {data.summaries.map((summary) => (
          <KpiTile key={summary.period} label={`${summary.period} tokens`} value={summary.tokens.toLocaleString()} helper={`$${summary.estimatedCost.toFixed(2)} • $${summary.costPerSuccessfulTask.toFixed(2)}/success`} />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Token usage over time">
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={data.history}>
                <XAxis dataKey="day" /><YAxis /><Tooltip />
                <Line type="monotone" dataKey="tokens" stroke="#38bdf8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Top 5 most expensive agents">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={data.byAgent}>
                <XAxis dataKey="name" hide /><YAxis /><Tooltip />
                <Bar dataKey="cost" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  );
}
