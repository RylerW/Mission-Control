import { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import { getDailyTasks } from '../../services/mockApi';
import { Task, TaskSource, TaskStatus } from '../../types/domain';

export function DailyReportsPage() {
  const [sourceFilter, setSourceFilter] = useState<'all' | TaskSource>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [tasks, setTasks] = useState<{ completed: Task[]; upcoming: Task[] } | null>(null);

  useEffect(() => {
    getDailyTasks().then(setTasks);
  }, []);

  const filteredCompleted = useMemo(() => {
    if (!tasks) return [];
    return tasks.completed.filter((task) => (sourceFilter === 'all' || task.source === sourceFilter) && (statusFilter === 'all' || task.status === statusFilter));
  }, [tasks, sourceFilter, statusFilter]);

  if (!tasks) return <p>Loading...</p>;

  const columns = [
    { key: 'source', header: 'Source', render: (task: Task) => task.source },
    { key: 'name', header: 'Task name', render: (task: Task) => task.name },
    { key: 'status', header: 'Status', render: (task: Task) => <StatusBadge status={task.status} /> },
    { key: 'startedAt', header: 'Started', render: (task: Task) => task.startedAt },
    { key: 'completedAt', header: 'Completed', render: (task: Task) => task.completedAt ?? '—' },
    { key: 'duration', header: 'Duration', render: (task: Task) => `${task.durationMinutes}m` },
    { key: 'cost', header: 'Cost', render: (task: Task) => (task.costTokens ? `${task.costTokens} tok` : '—') }
  ];

  return (
    <>
      <SectionHeader title="Daily Reports" description="Completed and upcoming tasks from agents, bots, workflows and manual operations." />
      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm">Total Completed</p><p className="text-2xl font-semibold">{tasks.completed.length}</p></Card>
        <Card><p className="text-sm">Upcoming</p><p className="text-2xl font-semibold">{tasks.upcoming.length}</p></Card>
        <Card><p className="text-sm">Failures</p><p className="text-2xl font-semibold">{tasks.completed.filter((t) => t.status === 'failed').length}</p></Card>
      </div>
      <Card title="Filters">
        <div className="flex flex-wrap gap-3 text-sm">
          <input type="date" className="rounded border border-border bg-slate-900 px-2 py-1" />
          <input type="date" className="rounded border border-border bg-slate-900 px-2 py-1" />
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as 'all' | TaskSource)} className="rounded border border-border bg-slate-900 px-2 py-1">
            <option value="all">All sources</option><option value="agent">Agent</option><option value="bot">Bot</option><option value="n8n">n8n</option><option value="manual">Manual</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)} className="rounded border border-border bg-slate-900 px-2 py-1">
            <option value="all">All status</option><option value="success">Success</option><option value="failed">Failed</option><option value="in-progress">In Progress</option><option value="queued">Queued</option>
          </select>
        </div>
      </Card>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card title="Completed tasks">
          <DataTable columns={columns} rows={filteredCompleted} />
        </Card>
        <Card title="Scheduled / upcoming">
          <DataTable columns={columns} rows={tasks.upcoming} />
        </Card>
      </div>
    </>
  );
}
