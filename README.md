diff --git a/README.md b/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..65c7244bf3753b6f8b771ae5d5a03607c31ac64e
--- /dev/null
+++ b/README.md
@@ -0,0 +1,17 @@
+# Mission Control Dashboard (Scaffold)
+
+React + TypeScript + Tailwind scaffold for a modular Mission Control UI.
+
+## Architecture
+
+- `src/layout`: shell components (`Sidebar`, `Topbar`, `AppShell`).
+- `src/components`: reusable UI building blocks (`Card`, `SectionHeader`, `StatusBadge`, `KpiTile`, `DataTable`).
+- `src/features/*`: one feature module per section.
+- `src/types/domain.ts`: shared domain interfaces (`Task`, `ContentItem`, `SecurityIssue`, `Agent`, `TokenUsageSummary`, `Metric`).
+- `src/services/mockApi.ts`: asynchronous mocked data services for future API replacement.
+- `src/config/navigation.ts`: configuration-driven route navigation metadata.
+
+## Extending
+
+- Replace methods in `src/services/mockApi.ts` with HTTP calls to n8n, agent registry, SIEM/RMM, and token logs.
+- Keep feature pages focused on display and state; data shape is centralized in `src/types/domain.ts`.
diff --git a/index.html b/index.html
new file mode 100644
index 0000000000000000000000000000000000000000..de2458e5a120563391da4b4af411ba500847947a
--- /dev/null
+++ b/index.html
@@ -0,0 +1,12 @@
+<!doctype html>
+<html lang="en">
+  <head>
+    <meta charset="UTF-8" />
+    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
+    <title>Mission Control</title>
+  </head>
+  <body>
+    <div id="root"></div>
+    <script type="module" src="/src/main.tsx"></script>
+  </body>
+</html>
diff --git a/package.json b/package.json
new file mode 100644
index 0000000000000000000000000000000000000000..bf7779c699a02ef5b656e41b1e933860765bfdd7
--- /dev/null
+++ b/package.json
@@ -0,0 +1,33 @@
+{
+  "name": "mission-control",
+  "private": true,
+  "version": "0.0.0",
+  "type": "module",
+  "scripts": {
+    "dev": "vite",
+    "build": "tsc && vite build",
+    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
+    "preview": "vite preview"
+  },
+  "dependencies": {
+    "react": "^18.3.1",
+    "react-dom": "^18.3.1",
+    "react-router-dom": "^6.30.1",
+    "recharts": "^2.15.1"
+  },
+  "devDependencies": {
+    "@types/react": "^18.3.3",
+    "@types/react-dom": "^18.3.0",
+    "@typescript-eslint/eslint-plugin": "^7.15.0",
+    "@typescript-eslint/parser": "^7.15.0",
+    "@vitejs/plugin-react": "^4.3.1",
+    "autoprefixer": "^10.4.20",
+    "eslint": "^8.57.0",
+    "eslint-plugin-react-hooks": "^4.6.2",
+    "eslint-plugin-react-refresh": "^0.4.7",
+    "postcss": "^8.5.3",
+    "tailwindcss": "^3.4.17",
+    "typescript": "~5.2.2",
+    "vite": "^5.4.1"
+  }
+}
diff --git a/postcss.config.js b/postcss.config.js
new file mode 100644
index 0000000000000000000000000000000000000000..ba80730477d1dd22b1484282d594f2e5dda4785a
--- /dev/null
+++ b/postcss.config.js
@@ -0,0 +1,6 @@
+export default {
+  plugins: {
+    tailwindcss: {},
+    autoprefixer: {}
+  }
+};
diff --git a/src/App.tsx b/src/App.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..df85ed1a732e95c8cf52096ce4f8683425422aa0
--- /dev/null
+++ b/src/App.tsx
@@ -0,0 +1,30 @@
+import { Navigate, Route, Routes } from 'react-router-dom';
+import { AppShell } from './layout/AppShell';
+import { AgentsPage } from './features/agents/AgentsPage';
+import { ContentPipelinePage } from './features/content-pipeline/ContentPipelinePage';
+import { DailyReportsPage } from './features/daily-reports/DailyReportsPage';
+import { BusinessMetricsPage } from './features/metrics/BusinessMetricsPage';
+import { OverviewPage } from './features/overview/OverviewPage';
+import { SecurityPage } from './features/security/SecurityPage';
+import { SettingsPage } from './features/settings/SettingsPage';
+import { TokensPage } from './features/tokens/TokensPage';
+
+function App() {
+  return (
+    <AppShell>
+      <Routes>
+        <Route path="/" element={<OverviewPage />} />
+        <Route path="/daily-reports" element={<DailyReportsPage />} />
+        <Route path="/content-pipeline" element={<ContentPipelinePage />} />
+        <Route path="/security" element={<SecurityPage />} />
+        <Route path="/agents" element={<AgentsPage />} />
+        <Route path="/tokens" element={<TokensPage />} />
+        <Route path="/business-metrics" element={<BusinessMetricsPage />} />
+        <Route path="/settings" element={<SettingsPage />} />
+        <Route path="*" element={<Navigate to="/" replace />} />
+      </Routes>
+    </AppShell>
+  );
+}
+
+export default App;
diff --git a/src/components/Card.tsx b/src/components/Card.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..428d6f115f142fc9f886353453dfe47ab7ff702a
--- /dev/null
+++ b/src/components/Card.tsx
@@ -0,0 +1,21 @@
+import { ReactNode } from 'react';
+
+interface CardProps {
+  title?: string;
+  action?: ReactNode;
+  children: ReactNode;
+}
+
+export function Card({ title, action, children }: CardProps) {
+  return (
+    <section className="rounded-xl border border-border bg-panel p-4 shadow-lg shadow-slate-950/20">
+      {(title || action) && (
+        <header className="mb-3 flex items-center justify-between">
+          {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
+          {action}
+        </header>
+      )}
+      {children}
+    </section>
+  );
+}
diff --git a/src/components/DataTable.tsx b/src/components/DataTable.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..905c7713f502a7e3d53e89494f253ac5986c4aec
--- /dev/null
+++ b/src/components/DataTable.tsx
@@ -0,0 +1,41 @@
+import { ReactNode } from 'react';
+
+interface Column<T> {
+  key: string;
+  header: string;
+  render: (row: T) => ReactNode;
+}
+
+interface DataTableProps<T> {
+  columns: Column<T>[];
+  rows: T[];
+}
+
+export function DataTable<T>({ columns, rows }: DataTableProps<T>) {
+  return (
+    <div className="overflow-x-auto">
+      <table className="min-w-full text-left text-sm">
+        <thead>
+          <tr className="border-b border-border text-xs uppercase text-slate-400">
+            {columns.map((column) => (
+              <th key={column.key} className="px-3 py-2 font-medium">
+                {column.header}
+              </th>
+            ))}
+          </tr>
+        </thead>
+        <tbody>
+          {rows.map((row, index) => (
+            <tr key={index} className="border-b border-border/50">
+              {columns.map((column) => (
+                <td key={column.key} className="px-3 py-3 align-top">
+                  {column.render(row)}
+                </td>
+              ))}
+            </tr>
+          ))}
+        </tbody>
+      </table>
+    </div>
+  );
+}
diff --git a/src/components/KpiTile.tsx b/src/components/KpiTile.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..d6f317308507e33ef6182286041e84ace44fd3cd
--- /dev/null
+++ b/src/components/KpiTile.tsx
@@ -0,0 +1,17 @@
+import { Card } from './Card';
+
+interface KpiTileProps {
+  label: string;
+  value: string;
+  helper?: string;
+}
+
+export function KpiTile({ label, value, helper }: KpiTileProps) {
+  return (
+    <Card>
+      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
+      <p className="mt-2 text-2xl font-semibold">{value}</p>
+      {helper && <p className="mt-1 text-xs text-slate-400">{helper}</p>}
+    </Card>
+  );
+}
diff --git a/src/components/SectionHeader.tsx b/src/components/SectionHeader.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..e34078bf0008d0fbbbf7dafc46f9f26b2bff9413
--- /dev/null
+++ b/src/components/SectionHeader.tsx
@@ -0,0 +1,19 @@
+import { ReactNode } from 'react';
+
+interface SectionHeaderProps {
+  title: string;
+  description?: string;
+  actions?: ReactNode;
+}
+
+export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
+  return (
+    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
+      <div>
+        <h1 className="text-2xl font-semibold">{title}</h1>
+        {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
+      </div>
+      {actions}
+    </div>
+  );
+}
diff --git a/src/components/StatusBadge.tsx b/src/components/StatusBadge.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..75c5c43b09d652765914f09d75b9e423a2921be7
--- /dev/null
+++ b/src/components/StatusBadge.tsx
@@ -0,0 +1,33 @@
+interface StatusBadgeProps {
+  status: string;
+}
+
+const statusColor: Record<string, string> = {
+  success: 'bg-emerald-500/20 text-emerald-300',
+  online: 'bg-emerald-500/20 text-emerald-300',
+  resolved: 'bg-emerald-500/20 text-emerald-300',
+  failed: 'bg-rose-500/20 text-rose-300',
+  error: 'bg-rose-500/20 text-rose-300',
+  critical: 'bg-rose-500/20 text-rose-300',
+  queued: 'bg-amber-500/20 text-amber-300',
+  'in-progress': 'bg-sky-500/20 text-sky-300',
+  'in progress': 'bg-sky-500/20 text-sky-300',
+  maintenance: 'bg-violet-500/20 text-violet-300',
+  paused: 'bg-slate-500/30 text-slate-300',
+  degraded: 'bg-orange-500/20 text-orange-300',
+  offline: 'bg-slate-500/30 text-slate-300',
+  open: 'bg-rose-500/20 text-rose-300',
+  ignored: 'bg-slate-500/30 text-slate-300',
+  high: 'bg-orange-500/20 text-orange-300',
+  medium: 'bg-amber-500/20 text-amber-300',
+  low: 'bg-sky-500/20 text-sky-300'
+};
+
+export function StatusBadge({ status }: StatusBadgeProps) {
+  const colorClass = statusColor[status] ?? 'bg-slate-500/20 text-slate-300';
+  return (
+    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${colorClass}`}>
+      {status}
+    </span>
+  );
+}
diff --git a/src/config/navigation.ts b/src/config/navigation.ts
new file mode 100644
index 0000000000000000000000000000000000000000..6f413cab82537702a2a3d76edbcf9adec5d7684e
--- /dev/null
+++ b/src/config/navigation.ts
@@ -0,0 +1,10 @@
+export const navItems = [
+  { path: '/', label: 'Overview' },
+  { path: '/daily-reports', label: 'Daily Reports' },
+  { path: '/content-pipeline', label: 'Content Pipeline' },
+  { path: '/security', label: 'Security' },
+  { path: '/agents', label: 'AI Agents & Bots' },
+  { path: '/tokens', label: 'Tokens & Costs' },
+  { path: '/business-metrics', label: 'Business Metrics' },
+  { path: '/settings', label: 'Settings' }
+];
diff --git a/src/features/agents/AgentsPage.tsx b/src/features/agents/AgentsPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..d4f3ad9104cc4a1e3123477d470e6f446cfa3499
--- /dev/null
+++ b/src/features/agents/AgentsPage.tsx
@@ -0,0 +1,53 @@
+import { useEffect, useState } from 'react';
+import { Card } from '../../components/Card';
+import { DataTable } from '../../components/DataTable';
+import { SectionHeader } from '../../components/SectionHeader';
+import { StatusBadge } from '../../components/StatusBadge';
+import { getAgents } from '../../services/mockApi';
+import { Agent } from '../../types/domain';
+
+export function AgentsPage() {
+  const [agents, setAgents] = useState<Agent[]>([]);
+  const [selected, setSelected] = useState<Agent | null>(null);
+
+  useEffect(() => {
+    getAgents().then(setAgents);
+  }, []);
+
+  return (
+    <>
+      <SectionHeader title="AI Agents & Bots" description="Monitor and register AI agents, n8n workflows and automation bots." />
+      <Card title="Agent registry">
+        <DataTable
+          rows={agents}
+          columns={[
+            { key: 'name', header: 'Name', render: (agent: Agent) => <button className="text-sky-300 underline-offset-2 hover:underline" onClick={() => setSelected(agent)}>{agent.name}</button> },
+            { key: 'type', header: 'Type', render: (agent: Agent) => agent.type },
+            { key: 'status', header: 'Status', render: (agent: Agent) => <StatusBadge status={agent.status} /> },
+            { key: 'owner', header: 'Owner', render: (agent: Agent) => agent.owner },
+            { key: 'tasks', header: 'Tasks today', render: (agent: Agent) => agent.metrics.tasksToday },
+            { key: 'duration', header: 'Avg duration', render: (agent: Agent) => `${agent.metrics.avgDurationMinutes}m` },
+            { key: 'error', header: 'Error rate', render: (agent: Agent) => `${agent.metrics.errorRate}%` },
+            { key: 'tokens', header: 'Token usage', render: (agent: Agent) => agent.metrics.tokenUsage.toLocaleString() }
+          ]}
+        />
+      </Card>
+
+      {selected && (
+        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-border bg-surface p-5 shadow-2xl">
+          <div className="mb-4 flex items-start justify-between">
+            <h3 className="text-lg font-semibold">{selected.name}</h3>
+            <button className="text-sm text-slate-300" onClick={() => setSelected(null)}>Close</button>
+          </div>
+          <p className="text-sm text-slate-300">{selected.description}</p>
+          <div className="mt-4 space-y-2 text-sm">
+            <p>Model: {selected.configSummary.model}</p>
+            <p>Endpoint: {selected.configSummary.endpoint}</p>
+            <p>Scopes: {selected.configSummary.scopes.join(', ')}</p>
+          </div>
+          <button className="mt-4 rounded bg-sky-600 px-3 py-2 text-sm">Toggle enable/disable</button>
+        </div>
+      )}
+    </>
+  );
+}
diff --git a/src/features/content-pipeline/ContentPipelinePage.tsx b/src/features/content-pipeline/ContentPipelinePage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..7df6d17409cc8019df07de3dd6cdb13695c87a73
--- /dev/null
+++ b/src/features/content-pipeline/ContentPipelinePage.tsx
@@ -0,0 +1,63 @@
+import { useEffect, useMemo, useState } from 'react';
+import { Card } from '../../components/Card';
+import { SectionHeader } from '../../components/SectionHeader';
+import { StatusBadge } from '../../components/StatusBadge';
+import { getContentItems } from '../../services/mockApi';
+import { ContentItem } from '../../types/domain';
+
+const stages: ContentItem['status'][] = ['ideas', 'drafting', 'in-review', 'scheduled', 'published'];
+
+export function ContentPipelinePage() {
+  const [items, setItems] = useState<ContentItem[]>([]);
+  const [open, setOpen] = useState(false);
+
+  useEffect(() => {
+    getContentItems().then(setItems);
+  }, []);
+
+  const grouped = useMemo(() => stages.map((stage) => ({ stage, items: items.filter((i) => i.status === stage) })), [items]);
+
+  return (
+    <>
+      <SectionHeader
+        title="Content Pipeline"
+        description="Track work from ideas through publication for every channel."
+        actions={<button onClick={() => setOpen(true)} className="rounded bg-sky-600 px-3 py-2 text-sm">New Idea</button>}
+      />
+      <div className="grid gap-4 xl:grid-cols-5">
+        {grouped.map((group) => (
+          <Card key={group.stage} title={group.stage.replace('-', ' ')}>
+            <div className="space-y-3">
+              {group.items.map((item) => (
+                <div key={item.id} className="rounded border border-border bg-slate-900 p-2">
+                  <p className="text-sm font-medium">{item.title}</p>
+                  <p className="mt-1 text-xs text-slate-400">{item.type} • {item.owner}</p>
+                  <div className="mt-2 flex items-center justify-between">
+                    <StatusBadge status={item.priority} />
+                    <span className="text-xs text-slate-400">{item.targetDate}</span>
+                  </div>
+                </div>
+              ))}
+            </div>
+          </Card>
+        ))}
+      </div>
+
+      {open && (
+        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
+          <Card title="New Idea" action={<button onClick={() => setOpen(false)} className="text-xs text-slate-300">Close</button>}>
+            <form className="grid w-[28rem] gap-3 text-sm">
+              <input placeholder="Title" className="rounded border border-border bg-slate-900 px-2 py-1" />
+              <select className="rounded border border-border bg-slate-900 px-2 py-1"><option>Blog</option><option>Short-form video</option><option>Social post</option><option>Email</option></select>
+              <input placeholder="Tags" className="rounded border border-border bg-slate-900 px-2 py-1" />
+              <select className="rounded border border-border bg-slate-900 px-2 py-1"><option>High</option><option>Medium</option><option>Low</option></select>
+              <textarea placeholder="Brief description" className="rounded border border-border bg-slate-900 px-2 py-1" rows={3} />
+              <input placeholder="Target channels" className="rounded border border-border bg-slate-900 px-2 py-1" />
+              <button type="button" onClick={() => setOpen(false)} className="rounded bg-sky-600 px-3 py-2">Save idea</button>
+            </form>
+          </Card>
+        </div>
+      )}
+    </>
+  );
+}
diff --git a/src/features/daily-reports/DailyReportsPage.tsx b/src/features/daily-reports/DailyReportsPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..dddb44119f5f08c7bdfc9213399cab0fc7861ee7
--- /dev/null
+++ b/src/features/daily-reports/DailyReportsPage.tsx
@@ -0,0 +1,65 @@
+import { useEffect, useMemo, useState } from 'react';
+import { Card } from '../../components/Card';
+import { DataTable } from '../../components/DataTable';
+import { SectionHeader } from '../../components/SectionHeader';
+import { StatusBadge } from '../../components/StatusBadge';
+import { getDailyTasks } from '../../services/mockApi';
+import { Task, TaskSource, TaskStatus } from '../../types/domain';
+
+export function DailyReportsPage() {
+  const [sourceFilter, setSourceFilter] = useState<'all' | TaskSource>('all');
+  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
+  const [tasks, setTasks] = useState<{ completed: Task[]; upcoming: Task[] } | null>(null);
+
+  useEffect(() => {
+    getDailyTasks().then(setTasks);
+  }, []);
+
+  const filteredCompleted = useMemo(() => {
+    if (!tasks) return [];
+    return tasks.completed.filter((task) => (sourceFilter === 'all' || task.source === sourceFilter) && (statusFilter === 'all' || task.status === statusFilter));
+  }, [tasks, sourceFilter, statusFilter]);
+
+  if (!tasks) return <p>Loading...</p>;
+
+  const columns = [
+    { key: 'source', header: 'Source', render: (task: Task) => task.source },
+    { key: 'name', header: 'Task name', render: (task: Task) => task.name },
+    { key: 'status', header: 'Status', render: (task: Task) => <StatusBadge status={task.status} /> },
+    { key: 'startedAt', header: 'Started', render: (task: Task) => task.startedAt },
+    { key: 'completedAt', header: 'Completed', render: (task: Task) => task.completedAt ?? '—' },
+    { key: 'duration', header: 'Duration', render: (task: Task) => `${task.durationMinutes}m` },
+    { key: 'cost', header: 'Cost', render: (task: Task) => (task.costTokens ? `${task.costTokens} tok` : '—') }
+  ];
+
+  return (
+    <>
+      <SectionHeader title="Daily Reports" description="Completed and upcoming tasks from agents, bots, workflows and manual operations." />
+      <div className="mb-4 grid gap-4 md:grid-cols-3">
+        <Card><p className="text-sm">Total Completed</p><p className="text-2xl font-semibold">{tasks.completed.length}</p></Card>
+        <Card><p className="text-sm">Upcoming</p><p className="text-2xl font-semibold">{tasks.upcoming.length}</p></Card>
+        <Card><p className="text-sm">Failures</p><p className="text-2xl font-semibold">{tasks.completed.filter((t) => t.status === 'failed').length}</p></Card>
+      </div>
+      <Card title="Filters">
+        <div className="flex flex-wrap gap-3 text-sm">
+          <input type="date" className="rounded border border-border bg-slate-900 px-2 py-1" />
+          <input type="date" className="rounded border border-border bg-slate-900 px-2 py-1" />
+          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value as 'all' | TaskSource)} className="rounded border border-border bg-slate-900 px-2 py-1">
+            <option value="all">All sources</option><option value="agent">Agent</option><option value="bot">Bot</option><option value="n8n">n8n</option><option value="manual">Manual</option>
+          </select>
+          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | TaskStatus)} className="rounded border border-border bg-slate-900 px-2 py-1">
+            <option value="all">All status</option><option value="success">Success</option><option value="failed">Failed</option><option value="in-progress">In Progress</option><option value="queued">Queued</option>
+          </select>
+        </div>
+      </Card>
+      <div className="mt-4 grid gap-4 xl:grid-cols-2">
+        <Card title="Completed tasks">
+          <DataTable columns={columns} rows={filteredCompleted} />
+        </Card>
+        <Card title="Scheduled / upcoming">
+          <DataTable columns={columns} rows={tasks.upcoming} />
+        </Card>
+      </div>
+    </>
+  );
+}
diff --git a/src/features/metrics/BusinessMetricsPage.tsx b/src/features/metrics/BusinessMetricsPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..761605f754da787e5d241b5f0fac5b8ea5f612eb
--- /dev/null
+++ b/src/features/metrics/BusinessMetricsPage.tsx
@@ -0,0 +1,41 @@
+import { useEffect, useState } from 'react';
+import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
+import { Card } from '../../components/Card';
+import { SectionHeader } from '../../components/SectionHeader';
+import { getBusinessMetrics } from '../../services/mockApi';
+
+export function BusinessMetricsPage() {
+  const [data, setData] = useState<Awaited<ReturnType<typeof getBusinessMetrics>> | null>(null);
+
+  useEffect(() => {
+    getBusinessMetrics().then(setData);
+  }, []);
+
+  if (!data) return <p>Loading...</p>;
+
+  return (
+    <>
+      <SectionHeader title="Business Metrics" description="High-level efficiency and operational outcomes driven by automation." />
+      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
+        {data.cards.map((metric) => (
+          <Card key={metric.id}>
+            <p className="text-xs text-slate-400">{metric.label}</p>
+            <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
+            <p className={`text-xs ${metric.trend === 'down' ? 'text-rose-300' : 'text-emerald-300'}`}>{metric.delta}</p>
+          </Card>
+        ))}
+      </div>
+      <Card title="Trends over time">
+        <div className="h-64">
+          <ResponsiveContainer>
+            <LineChart data={data.trend}>
+              <XAxis dataKey="week" /><YAxis /><Tooltip />
+              <Line type="monotone" dataKey="leads" stroke="#38bdf8" />
+              <Line type="monotone" dataKey="conversions" stroke="#22c55e" />
+            </LineChart>
+          </ResponsiveContainer>
+        </div>
+      </Card>
+    </>
+  );
+}
diff --git a/src/features/overview/OverviewPage.tsx b/src/features/overview/OverviewPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..061b797ef0d7b71b537e0b5a1b7de343ddba0e24
--- /dev/null
+++ b/src/features/overview/OverviewPage.tsx
@@ -0,0 +1,48 @@
+import { useEffect, useState } from 'react';
+import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
+import { Card } from '../../components/Card';
+import { KpiTile } from '../../components/KpiTile';
+import { SectionHeader } from '../../components/SectionHeader';
+import { getOverviewSnapshot } from '../../services/mockApi';
+
+export function OverviewPage() {
+  const [data, setData] = useState<Awaited<ReturnType<typeof getOverviewSnapshot>> | null>(null);
+
+  useEffect(() => {
+    getOverviewSnapshot().then(setData);
+  }, []);
+
+  if (!data) return <p>Loading...</p>;
+
+  return (
+    <>
+      <SectionHeader title="Overview" description="Live mission snapshot across automations, AI, security and operations." />
+      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
+        <KpiTile label="Completed tasks" value={String(data.completedTasks)} helper={`${data.failedTasks} failed`} />
+        <KpiTile label="Scheduled tasks" value={String(data.scheduledTasks)} helper="next 24 hours" />
+        <KpiTile label="Active agents/bots" value={String(data.activeAgents)} helper="online + degraded" />
+        <KpiTile label="Security posture" value={`${data.securityItemsToReview} to review`} helper={`${data.pendingPatches} pending patches`} />
+      </div>
+      <div className="mt-4 grid gap-4 lg:grid-cols-2">
+        <Card title="Token usage vs baseline">
+          <p className="mb-2 text-sm text-slate-300">{data.tokenToday.toLocaleString()} tokens today vs {data.tokenBaseline.toLocaleString()} baseline.</p>
+          <div className="h-32">
+            <ResponsiveContainer>
+              <AreaChart data={data.sparkline.map((v, i) => ({ name: `T${i + 1}`, value: v }))}>
+                <Tooltip />
+                <Area type="monotone" dataKey="value" stroke="#38bdf8" fill="#0ea5e933" />
+              </AreaChart>
+            </ResponsiveContainer>
+          </div>
+        </Card>
+        <Card title="Business KPIs">
+          <div className="space-y-2 text-sm">
+            <p>Revenue: <span className="font-semibold">{data.business.revenue}</span></p>
+            <p>Leads: <span className="font-semibold">{data.business.leads}</span></p>
+            <p>Conversion: <span className="font-semibold">{data.business.conversion}</span></p>
+          </div>
+        </Card>
+      </div>
+    </>
+  );
+}
diff --git a/src/features/security/SecurityPage.tsx b/src/features/security/SecurityPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..11249b31dbbab59faf947de97b5a353a5b1412ef
--- /dev/null
+++ b/src/features/security/SecurityPage.tsx
@@ -0,0 +1,46 @@
+import { useEffect, useState } from 'react';
+import { Card } from '../../components/Card';
+import { DataTable } from '../../components/DataTable';
+import { SectionHeader } from '../../components/SectionHeader';
+import { StatusBadge } from '../../components/StatusBadge';
+import { getSecurityIssues } from '../../services/mockApi';
+import { SecurityIssue } from '../../types/domain';
+
+export function SecurityPage() {
+  const [data, setData] = useState<Awaited<ReturnType<typeof getSecurityIssues>> | null>(null);
+
+  useEffect(() => {
+    getSecurityIssues().then(setData);
+  }, []);
+
+  if (!data) return <p>Loading...</p>;
+
+  return (
+    <>
+      <SectionHeader title="Security" description="Operational hardening and issue triage for your stack." />
+      <div className="mb-4 grid gap-4 md:grid-cols-3">
+        <Card><p className="text-xs text-slate-400">Security posture score</p><p className="text-3xl font-semibold">{data.score}</p></Card>
+        <Card><p className="text-xs text-slate-400">Open findings</p><p className="text-3xl font-semibold">{data.findings.filter((f) => f.status === 'open').length}</p></Card>
+        <Card><p className="text-xs text-slate-400">Critical findings</p><p className="text-3xl font-semibold">{data.findings.filter((f) => f.severity === 'critical').length}</p></Card>
+      </div>
+      <Card title="Security alerts & findings">
+        <DataTable
+          rows={data.findings}
+          columns={[
+            { key: 'title', header: 'Title', render: (row: SecurityIssue) => row.title },
+            { key: 'severity', header: 'Severity', render: (row: SecurityIssue) => <StatusBadge status={row.severity} /> },
+            { key: 'category', header: 'Category', render: (row: SecurityIssue) => row.category },
+            { key: 'source', header: 'Source', render: (row: SecurityIssue) => row.source },
+            { key: 'status', header: 'Status', render: (row: SecurityIssue) => <StatusBadge status={row.status} /> },
+            { key: 'updated', header: 'Last updated', render: (row: SecurityIssue) => row.lastUpdated }
+          ]}
+        />
+      </Card>
+      <Card title="Upcoming security tasks">
+        <ul className="list-disc pl-5 text-sm text-slate-300">
+          {data.upcoming.map((item) => <li key={item}>{item}</li>)}
+        </ul>
+      </Card>
+    </>
+  );
+}
diff --git a/src/features/settings/SettingsPage.tsx b/src/features/settings/SettingsPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..e18a9f78648d6e3b60059b546610daaddcc1e87a
--- /dev/null
+++ b/src/features/settings/SettingsPage.tsx
@@ -0,0 +1,13 @@
+import { Card } from '../../components/Card';
+import { SectionHeader } from '../../components/SectionHeader';
+
+export function SettingsPage() {
+  return (
+    <>
+      <SectionHeader title="Settings" description="Configuration placeholders for integrations and environment profiles." />
+      <Card title="Integrations">
+        <p className="text-sm text-slate-300">Plug in n8n API keys, AI agent registry endpoints, security feeds, and token usage logs in /src/services when ready.</p>
+      </Card>
+    </>
+  );
+}
diff --git a/src/features/tokens/TokensPage.tsx b/src/features/tokens/TokensPage.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..40c54cada0c91cedcfc16cb26bd2f95cde9bb394
--- /dev/null
+++ b/src/features/tokens/TokensPage.tsx
@@ -0,0 +1,49 @@
+import { useEffect, useState } from 'react';
+import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
+import { Card } from '../../components/Card';
+import { KpiTile } from '../../components/KpiTile';
+import { SectionHeader } from '../../components/SectionHeader';
+import { getTokenUsage } from '../../services/mockApi';
+
+export function TokensPage() {
+  const [data, setData] = useState<Awaited<ReturnType<typeof getTokenUsage>> | null>(null);
+
+  useEffect(() => {
+    getTokenUsage().then(setData);
+  }, []);
+
+  if (!data) return <p>Loading...</p>;
+
+  return (
+    <>
+      <SectionHeader title="Tokens & Costs" description="Monitor usage, efficiency and spend across AI components." />
+      <div className="grid gap-4 md:grid-cols-3">
+        {data.summaries.map((summary) => (
+          <KpiTile key={summary.period} label={`${summary.period} tokens`} value={summary.tokens.toLocaleString()} helper={`$${summary.estimatedCost.toFixed(2)} • $${summary.costPerSuccessfulTask.toFixed(2)}/success`} />
+        ))}
+      </div>
+      <div className="mt-4 grid gap-4 lg:grid-cols-2">
+        <Card title="Token usage over time">
+          <div className="h-56">
+            <ResponsiveContainer>
+              <LineChart data={data.history}>
+                <XAxis dataKey="day" /><YAxis /><Tooltip />
+                <Line type="monotone" dataKey="tokens" stroke="#38bdf8" strokeWidth={2} />
+              </LineChart>
+            </ResponsiveContainer>
+          </div>
+        </Card>
+        <Card title="Top 5 most expensive agents">
+          <div className="h-56">
+            <ResponsiveContainer>
+              <BarChart data={data.byAgent}>
+                <XAxis dataKey="name" hide /><YAxis /><Tooltip />
+                <Bar dataKey="cost" fill="#0ea5e9" />
+              </BarChart>
+            </ResponsiveContainer>
+          </div>
+        </Card>
+      </div>
+    </>
+  );
+}
diff --git a/src/layout/AppShell.tsx b/src/layout/AppShell.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..4f4665498b0cb730e468256b755e11a4f28122e3
--- /dev/null
+++ b/src/layout/AppShell.tsx
@@ -0,0 +1,15 @@
+import { ReactNode } from 'react';
+import { Sidebar } from './Sidebar';
+import { Topbar } from './Topbar';
+
+export function AppShell({ children }: { children: ReactNode }) {
+  return (
+    <div className="flex min-h-screen bg-slate-950 text-slate-100">
+      <Sidebar />
+      <div className="flex flex-1 flex-col">
+        <Topbar />
+        <main className="flex-1 overflow-y-auto p-6">{children}</main>
+      </div>
+    </div>
+  );
+}
diff --git a/src/layout/Sidebar.tsx b/src/layout/Sidebar.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..1135bd38a991ec47fdc023e21c4c2e12af28f6f2
--- /dev/null
+++ b/src/layout/Sidebar.tsx
@@ -0,0 +1,26 @@
+import { NavLink } from 'react-router-dom';
+import { navItems } from '../config/navigation';
+
+export function Sidebar() {
+  return (
+    <aside className="hidden w-64 flex-col border-r border-border bg-surface p-4 lg:flex">
+      <h2 className="mb-8 text-lg font-semibold">Mission Control</h2>
+      <nav className="space-y-2">
+        {navItems.map((item) => (
+          <NavLink
+            key={item.path}
+            to={item.path}
+            end={item.path === '/'}
+            className={({ isActive }) =>
+              `block rounded-md px-3 py-2 text-sm transition ${
+                isActive ? 'bg-sky-600/20 text-sky-300' : 'text-slate-300 hover:bg-slate-800'
+              }`
+            }
+          >
+            {item.label}
+          </NavLink>
+        ))}
+      </nav>
+    </aside>
+  );
+}
diff --git a/src/layout/Topbar.tsx b/src/layout/Topbar.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..7be5a80a0a819167b26e084f74087338292de886
--- /dev/null
+++ b/src/layout/Topbar.tsx
@@ -0,0 +1,19 @@
+export function Topbar() {
+  return (
+    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
+      <div>
+        <p className="text-xs uppercase text-slate-400">Environment</p>
+        <p className="text-sm font-medium">Production-like / Dark Theme</p>
+      </div>
+      <div className="flex items-center gap-4">
+        <input
+          type="search"
+          placeholder="Quick search..."
+          className="rounded-md border border-border bg-panel px-3 py-2 text-sm placeholder:text-slate-500"
+        />
+        <p className="text-sm text-slate-300">{new Date().toLocaleDateString()}</p>
+        <div className="h-8 w-8 rounded-full bg-sky-600/40" />
+      </div>
+    </header>
+  );
+}
diff --git a/src/main.tsx b/src/main.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..cf4a0d396cc12d89c0d3e204276d419f4eba8aa8
--- /dev/null
+++ b/src/main.tsx
@@ -0,0 +1,13 @@
+import React from 'react';
+import ReactDOM from 'react-dom/client';
+import { BrowserRouter } from 'react-router-dom';
+import App from './App';
+import './styles.css';
+
+ReactDOM.createRoot(document.getElementById('root')!).render(
+  <React.StrictMode>
+    <BrowserRouter>
+      <App />
+    </BrowserRouter>
+  </React.StrictMode>
+);
diff --git a/src/services/mockApi.ts b/src/services/mockApi.ts
new file mode 100644
index 0000000000000000000000000000000000000000..9d6b6b749fe6114789e49bb73986dba66d26af09
--- /dev/null
+++ b/src/services/mockApi.ts
@@ -0,0 +1,135 @@
+import { Agent, ContentItem, Metric, SecurityIssue, Task, TokenUsageSummary } from '../types/domain';
+
+const delay = async () => new Promise((resolve) => setTimeout(resolve, 100));
+
+export async function getOverviewSnapshot() {
+  await delay();
+  return {
+    completedTasks: 143,
+    failedTasks: 7,
+    scheduledTasks: 28,
+    activeAgents: 12,
+    securityItemsToReview: 6,
+    pendingPatches: 4,
+    tokenToday: 182_500,
+    tokenBaseline: 160_000,
+    business: {
+      revenue: '$42.3k',
+      leads: '382',
+      conversion: '4.1%'
+    },
+    sparkline: [20, 30, 18, 35, 44, 38, 52]
+  };
+}
+
+export async function getDailyTasks(): Promise<{ completed: Task[]; upcoming: Task[] }> {
+  await delay();
+  const completed: Task[] = [
+    { id: 't1', source: 'agent', name: 'Summarize client brief', status: 'success', startedAt: '09:00', completedAt: '09:08', durationMinutes: 8, costTokens: 1200 },
+    { id: 't2', source: 'n8n', name: 'Publish weekly digest', status: 'failed', startedAt: '10:00', completedAt: '10:04', durationMinutes: 4, costTokens: 300 },
+    { id: 't3', source: 'bot', name: 'Update CRM tags', status: 'success', startedAt: '10:40', completedAt: '10:49', durationMinutes: 9, costTokens: 520 }
+  ];
+  const upcoming: Task[] = [
+    { id: 't4', source: 'manual', name: 'Approve ad copy', status: 'queued', startedAt: '14:00', durationMinutes: 0 },
+    { id: 't5', source: 'agent', name: 'Generate landing page variants', status: 'queued', startedAt: '15:15', durationMinutes: 0 }
+  ];
+  return { completed, upcoming };
+}
+
+export async function getContentItems(): Promise<ContentItem[]> {
+  await delay();
+  return [
+    { id: 'c1', title: 'AI onboarding checklist', type: 'blog', priority: 'high', owner: 'SEO Agent', targetDate: '2026-02-28', status: 'drafting', tags: ['onboarding', 'ai'] },
+    { id: 'c2', title: 'Automation mythbusters reel', type: 'video', priority: 'medium', owner: 'Video Bot', targetDate: '2026-03-02', status: 'in-review', tags: ['social'] },
+    { id: 'c3', title: 'Weekly product email', type: 'email', priority: 'high', owner: 'Growth Team', targetDate: '2026-02-27', status: 'scheduled', tags: ['retention'] }
+  ];
+}
+
+export async function getSecurityIssues(): Promise<{ score: number; findings: SecurityIssue[]; upcoming: string[] }> {
+  await delay();
+  return {
+    score: 86,
+    findings: [
+      { id: 's1', title: 'Outdated OpenSSL package', severity: 'high', category: 'patching', source: 'scanner', status: 'open', lastUpdated: '2h ago' },
+      { id: 's2', title: 'MFA gap for admin tool', severity: 'critical', category: 'access', source: 'manual review', status: 'in progress', lastUpdated: '30m ago' },
+      { id: 's3', title: 'Verbose logging in prod', severity: 'medium', category: 'monitoring', source: 'agent', status: 'resolved', lastUpdated: '1d ago' }
+    ],
+    upcoming: ['Patch cycle: Friday 23:00', 'Quarterly access audit: Mar 5', 'TLS certificate renewal: Mar 12']
+  };
+}
+
+export async function getAgents(): Promise<Agent[]> {
+  await delay();
+  return [
+    {
+      id: 'a1',
+      name: 'Content Strategist',
+      description: 'Generates briefs and channel plans from campaign goals.',
+      type: 'LLM agent',
+      status: 'online',
+      owner: 'Marketing Ops',
+      metrics: { tasksToday: 34, avgDurationMinutes: 6, errorRate: 1.2, tokenUsage: 44200 },
+      tags: ['content', 'planner'],
+      configSummary: { model: 'gpt-4.1', endpoint: '/agents/content-strategist', scopes: ['content:write', 'analytics:read'] }
+    },
+    {
+      id: 'a2',
+      name: 'Workflow Recovery Bot',
+      description: 'Retries and triages failed n8n workflows.',
+      type: 'custom bot',
+      status: 'degraded',
+      owner: 'Automation Team',
+      metrics: { tasksToday: 19, avgDurationMinutes: 4, errorRate: 6.8, tokenUsage: 12100 },
+      tags: ['n8n', 'reliability'],
+      configSummary: { model: 'claude-3.5-sonnet', endpoint: '/bots/recovery', scopes: ['workflows:read', 'workflows:retry'] }
+    }
+  ];
+}
+
+export async function getTokenUsage(): Promise<{ summaries: TokenUsageSummary[]; byProvider: { provider: string; tokens: number }[]; byAgent: { name: string; tokens: number; cost: number }[]; history: { day: string; tokens: number }[] }> {
+  await delay();
+  return {
+    summaries: [
+      { period: 'today', tokens: 182500, estimatedCost: 48.2, costPerSuccessfulTask: 0.39 },
+      { period: 'week', tokens: 992100, estimatedCost: 242.4, costPerSuccessfulTask: 0.44 },
+      { period: 'month', tokens: 4012300, estimatedCost: 1002.8, costPerSuccessfulTask: 0.47 }
+    ],
+    byProvider: [
+      { provider: 'OpenAI', tokens: 2300000 },
+      { provider: 'Anthropic', tokens: 1400000 },
+      { provider: 'Local', tokens: 312300 }
+    ],
+    byAgent: [
+      { name: 'Content Strategist', tokens: 44200, cost: 15.8 },
+      { name: 'Workflow Recovery Bot', tokens: 12100, cost: 7.1 },
+      { name: 'Lead Qualifier', tokens: 38100, cost: 12.4 },
+      { name: 'SEO Publisher', tokens: 32900, cost: 10.2 },
+      { name: 'Support Copilot', tokens: 27800, cost: 8.7 }
+    ],
+    history: [
+      { day: 'Mon', tokens: 144000 },
+      { day: 'Tue', tokens: 162000 },
+      { day: 'Wed', tokens: 155000 },
+      { day: 'Thu', tokens: 190000 },
+      { day: 'Fri', tokens: 182500 }
+    ]
+  };
+}
+
+export async function getBusinessMetrics(): Promise<{ cards: Metric[]; trend: { week: string; leads: number; conversions: number }[] }> {
+  await delay();
+  return {
+    cards: [
+      { id: 'm1', label: 'AI-generated leads', value: '382', delta: '+8.2%', trend: 'up' },
+      { id: 'm2', label: 'Conversion rate', value: '4.1%', delta: '+0.3%', trend: 'up' },
+      { id: 'm3', label: 'Automation time saved', value: '116h', delta: '+12h', trend: 'up' },
+      { id: 'm4', label: 'SLA met', value: '94%', delta: '-1.5%', trend: 'down' }
+    ],
+    trend: [
+      { week: 'W1', leads: 290, conversions: 3.5 },
+      { week: 'W2', leads: 310, conversions: 3.7 },
+      { week: 'W3', leads: 345, conversions: 3.9 },
+      { week: 'W4', leads: 382, conversions: 4.1 }
+    ]
+  };
+}
diff --git a/src/styles.css b/src/styles.css
new file mode 100644
index 0000000000000000000000000000000000000000..9e57b2745c90ee33f9a830babfe6f1db6e77b6f2
--- /dev/null
+++ b/src/styles.css
@@ -0,0 +1,8 @@
+@tailwind base;
+@tailwind components;
+@tailwind utilities;
+
+body {
+  @apply bg-slate-950 text-slate-100;
+  font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
+}
diff --git a/src/types/domain.ts b/src/types/domain.ts
new file mode 100644
index 0000000000000000000000000000000000000000..c5ea37df5ca7f7cbd435de9349e0a38fa181edbe
--- /dev/null
+++ b/src/types/domain.ts
@@ -0,0 +1,73 @@
+export type TaskSource = 'agent' | 'bot' | 'n8n' | 'manual';
+export type TaskStatus = 'success' | 'failed' | 'in-progress' | 'queued';
+
+export interface Task {
+  id: string;
+  source: TaskSource;
+  name: string;
+  status: TaskStatus;
+  startedAt: string;
+  completedAt?: string;
+  durationMinutes: number;
+  costTokens?: number;
+}
+
+export type ContentStage = 'ideas' | 'drafting' | 'in-review' | 'scheduled' | 'published';
+export type ContentType = 'blog' | 'video' | 'social' | 'email';
+
+export interface ContentItem {
+  id: string;
+  title: string;
+  type: ContentType;
+  priority: 'low' | 'medium' | 'high';
+  owner: string;
+  targetDate: string;
+  status: ContentStage;
+  tags: string[];
+}
+
+export interface SecurityIssue {
+  id: string;
+  title: string;
+  severity: 'low' | 'medium' | 'high' | 'critical';
+  category: 'patching' | 'configuration' | 'access' | 'network' | 'monitoring';
+  source: 'scanner' | 'manual review' | 'script' | 'agent';
+  status: 'open' | 'in progress' | 'resolved' | 'ignored';
+  lastUpdated: string;
+}
+
+export interface Agent {
+  id: string;
+  name: string;
+  description: string;
+  type: 'LLM agent' | 'n8n workflow' | 'custom bot' | 'integration';
+  status: 'online' | 'paused' | 'error' | 'maintenance' | 'degraded' | 'offline';
+  owner: string;
+  metrics: {
+    tasksToday: number;
+    avgDurationMinutes: number;
+    errorRate: number;
+    tokenUsage: number;
+  };
+  tags: string[];
+  configSummary: {
+    model: string;
+    endpoint: string;
+    scopes: string[];
+  };
+}
+
+export interface TokenUsageSummary {
+  period: 'today' | 'week' | 'month';
+  tokens: number;
+  estimatedCost: number;
+  costPerSuccessfulTask: number;
+}
+
+export interface Metric {
+  id: string;
+  label: string;
+  value: string;
+  delta?: string;
+  trend: 'up' | 'down' | 'neutral';
+}
diff --git a/tailwind.config.js b/tailwind.config.js
new file mode 100644
index 0000000000000000000000000000000000000000..21f253519059d8e5c6f4a368ce48ee9097612e68
--- /dev/null
+++ b/tailwind.config.js
@@ -0,0 +1,14 @@
+/** @type {import('tailwindcss').Config} */
+export default {
+  content: ['./index.html', './src/**/*.{ts,tsx}'],
+  theme: {
+    extend: {
+      colors: {
+        surface: '#101727',
+        panel: '#172236',
+        border: '#263249'
+      }
+    }
+  },
+  plugins: []
+};
diff --git a/tsconfig.app.json b/tsconfig.app.json
new file mode 100644
index 0000000000000000000000000000000000000000..cbeea5365f66094fd4f70afa3f980fe226b26ebf
--- /dev/null
+++ b/tsconfig.app.json
@@ -0,0 +1,18 @@
+{
+  "compilerOptions": {
+    "target": "ES2020",
+    "useDefineForClassFields": true,
+    "lib": ["ES2020", "DOM", "DOM.Iterable"],
+    "module": "ESNext",
+    "skipLibCheck": true,
+    "moduleResolution": "Bundler",
+    "allowImportingTsExtensions": false,
+    "resolveJsonModule": true,
+    "isolatedModules": true,
+    "noEmit": true,
+    "jsx": "react-jsx",
+    "strict": true,
+    "types": ["vite/client"]
+  },
+  "include": ["src"]
+}
diff --git a/tsconfig.json b/tsconfig.json
new file mode 100644
index 0000000000000000000000000000000000000000..3934b8f6d676d599058af5529521ad710c03121d
--- /dev/null
+++ b/tsconfig.json
@@ -0,0 +1,21 @@
+{
+  "compilerOptions": {
+    "target": "ES2020",
+    "useDefineForClassFields": true,
+    "lib": ["ES2020", "DOM", "DOM.Iterable"],
+    "module": "ESNext",
+    "skipLibCheck": true,
+    "moduleResolution": "bundler",
+    "allowImportingTsExtensions": true,
+    "resolveJsonModule": true,
+    "isolatedModules": true,
+    "noEmit": true,
+    "jsx": "react-jsx",
+    "strict": true,
+    "noUnusedLocals": true,
+    "noUnusedParameters": true,
+    "noFallthroughCasesInSwitch": true
+  },
+  "include": ["src"],
+  "references": [{ "path": "./tsconfig.node.json" }]
+}
diff --git a/tsconfig.node.json b/tsconfig.node.json
new file mode 100644
index 0000000000000000000000000000000000000000..3adda81a1ce0bda41fc82b9e6d70aa2f68069060
--- /dev/null
+++ b/tsconfig.node.json
@@ -0,0 +1,10 @@
+{
+  "compilerOptions": {
+    "composite": true,
+    "skipLibCheck": true,
+    "module": "ESNext",
+    "moduleResolution": "Bundler",
+    "allowSyntheticDefaultImports": true
+  },
+  "include": ["vite.config.ts"]
+}
diff --git a/vite.config.ts b/vite.config.ts
new file mode 100644
index 0000000000000000000000000000000000000000..dd1dc0c3f7936daf1f6e5b89a0ba0bcdc6bec376
--- /dev/null
+++ b/vite.config.ts
@@ -0,0 +1,7 @@
+import { defineConfig } from 'vite'
+import react from '@vitejs/plugin-react'
+
+export default defineConfig({
+  plugins: [react()],
+  base: '/', // or '/subpath/' if using subdir
+})
