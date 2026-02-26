import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { getSecurityIssues } from '../../services/mockApi';
import { SecurityIssue } from '../../types/domain';

export function SecurityPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getSecurityIssues>> | null>(null);

  useEffect(() => {
    getSecurityIssues().then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <SectionHeader title="Security" description="Operational hardening and issue triage for your stack." />
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Card><p className="text-xs text-slate-400">Security posture score</p><p className="text-3xl font-semibold">{data.score}</p></Card>
        <Card><p className="text-xs text-slate-400">Open findings</p><p className="text-3xl font-semibold">{data.findings.filter((f) => f.status === 'open').length}</p></Card>
        <Card><p className="text-xs text-slate-400">Critical findings</p><p className="text-3xl font-semibold">{data.findings.filter((f) => f.severity === 'critical').length}</p></Card>
      </div>
      <Card title="Security alerts & findings">
        <DataTable
          rows={data.findings}
          columns={[
            { key: 'title', header: 'Title', render: (row: SecurityIssue) => row.title },
            { key: 'severity', header: 'Severity', render: (row: SecurityIssue) => <StatusBadge status={row.severity} /> },
            { key: 'category', header: 'Category', render: (row: SecurityIssue) => row.category },
            { key: 'source', header: 'Source', render: (row: SecurityIssue) => row.source },
            { key: 'status', header: 'Status', render: (row: SecurityIssue) => <StatusBadge status={row.status} /> },
            { key: 'updated', header: 'Last updated', render: (row: SecurityIssue) => row.lastUpdated }
          ]}
        />
      </Card>
      <Card title="Upcoming security tasks">
        <ul className="list-disc pl-5 text-sm text-slate-300">
          {data.upcoming.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </Card>
    </>
  );
}
