import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { DataTable } from '../../components/DataTable';
import { SectionHeader } from '../../components/SectionHeader';
import { StatusBadge } from '../../components/StatusBadge';
import AgentStatusCard from '../../components/AgentStatusCard';
import TestN8n from '../../components/TestN8n';
import { getAgents, runAgentTask, toggleAgentStatus } from '../../services/mockApi';
import { Agent } from '../../types/domain';

export function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selected, setSelected] = useState<Agent | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const loadAgents = async () => {
    const nextAgents = await getAgents();
    setAgents(nextAgents);

    if (selected) {
      const nextSelected = nextAgents.find((agent) => agent.id === selected.id) ?? null;
      setSelected(nextSelected);
    }
  };

  useEffect(() => {
    loadAgents().catch((error) => {
      console.error('Failed to load agents', error);
    });
  }, []);

  const handleToggle = async (id: string) => {
    setIsMutating(true);
    try {
      await toggleAgentStatus(id);
      await loadAgents();
    } finally {
      setIsMutating(false);
    }
  };

  const handleRun = async (id: string) => {
    setIsMutating(true);
    try {
      await runAgentTask(id);
      await loadAgents();
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <>
      <SectionHeader title="AI Agents & Bots" description="Monitor and register AI agents, n8n workflows and automation bots." />
      <Card title="Agent status test">
        <AgentStatusCard />
      </Card>
      <Card title="n8n webhook test">
        <TestN8n />
      </Card>
      <Card title="Agent registry">
        <DataTable
          rows={agents}
          columns={[
            {
              key: 'name',
              header: 'Name',
              render: (agent: Agent) => (
                <button className="text-sky-300 underline-offset-2 hover:underline" onClick={() => setSelected(agent)}>
                  {agent.name}
                </button>
              )
            },
            { key: 'type', header: 'Type', render: (agent: Agent) => agent.type },
            { key: 'status', header: 'Status', render: (agent: Agent) => <StatusBadge status={agent.status} /> },
            { key: 'owner', header: 'Owner', render: (agent: Agent) => agent.owner },
            { key: 'tasks', header: 'Tasks today', render: (agent: Agent) => agent.metrics.tasksToday },
            { key: 'duration', header: 'Avg duration', render: (agent: Agent) => `${agent.metrics.avgDurationMinutes}m` },
            { key: 'error', header: 'Error rate', render: (agent: Agent) => `${agent.metrics.errorRate}%` },
            { key: 'tokens', header: 'Token usage', render: (agent: Agent) => agent.metrics.tokenUsage.toLocaleString() }
          ]}
        />
      </Card>

      {selected && (
        <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-border bg-surface p-5 shadow-2xl">
          <div className="mb-4 flex items-start justify-between">
            <h3 className="text-lg font-semibold">{selected.name}</h3>
            <button className="text-sm text-slate-300" onClick={() => setSelected(null)}>Close</button>
          </div>
          <p className="text-sm text-slate-300">{selected.description}</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>Model: {selected.configSummary.model}</p>
            <p>Endpoint: {selected.configSummary.endpoint}</p>
            <p>Scopes: {selected.configSummary.scopes.join(', ')}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              className="rounded bg-sky-600 px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => handleToggle(selected.id)}
              disabled={isMutating}
            >
              {selected.status === 'online' ? 'Pause' : 'Enable'}
            </button>
            <button
              className="rounded border border-border px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => handleRun(selected.id)}
              disabled={isMutating}
            >
              Run now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
