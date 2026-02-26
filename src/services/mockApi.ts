import { Agent, ContentItem, Metric, SecurityIssue, Task, TokenUsageSummary } from '../types/domain';

const delay = async () => new Promise((resolve) => setTimeout(resolve, 100));

export async function getOverviewSnapshot() {
  await delay();
  return {
    completedTasks: 143,
    failedTasks: 7,
    scheduledTasks: 28,
    activeAgents: 12,
    securityItemsToReview: 6,
    pendingPatches: 4,
    tokenToday: 182_500,
    tokenBaseline: 160_000,
    business: {
      revenue: '$42.3k',
      leads: '382',
      conversion: '4.1%'
    },
    sparkline: [20, 30, 18, 35, 44, 38, 52]
  };
}

export async function getDailyTasks(): Promise<{ completed: Task[]; upcoming: Task[] }> {
  await delay();
  const completed: Task[] = [
    { id: 't1', source: 'agent', name: 'Summarize client brief', status: 'success', startedAt: '09:00', completedAt: '09:08', durationMinutes: 8, costTokens: 1200 },
    { id: 't2', source: 'n8n', name: 'Publish weekly digest', status: 'failed', startedAt: '10:00', completedAt: '10:04', durationMinutes: 4, costTokens: 300 },
    { id: 't3', source: 'bot', name: 'Update CRM tags', status: 'success', startedAt: '10:40', completedAt: '10:49', durationMinutes: 9, costTokens: 520 }
  ];
  const upcoming: Task[] = [
    { id: 't4', source: 'manual', name: 'Approve ad copy', status: 'queued', startedAt: '14:00', durationMinutes: 0 },
    { id: 't5', source: 'agent', name: 'Generate landing page variants', status: 'queued', startedAt: '15:15', durationMinutes: 0 }
  ];
  return { completed, upcoming };
}

export async function getContentItems(): Promise<ContentItem[]> {
  await delay();
  return [
    { id: 'c1', title: 'AI onboarding checklist', type: 'blog', priority: 'high', owner: 'SEO Agent', targetDate: '2026-02-28', status: 'drafting', tags: ['onboarding', 'ai'] },
    { id: 'c2', title: 'Automation mythbusters reel', type: 'video', priority: 'medium', owner: 'Video Bot', targetDate: '2026-03-02', status: 'in-review', tags: ['social'] },
    { id: 'c3', title: 'Weekly product email', type: 'email', priority: 'high', owner: 'Growth Team', targetDate: '2026-02-27', status: 'scheduled', tags: ['retention'] }
  ];
}

export async function getSecurityIssues(): Promise<{ score: number; findings: SecurityIssue[]; upcoming: string[] }> {
  await delay();
  return {
    score: 86,
    findings: [
      { id: 's1', title: 'Outdated OpenSSL package', severity: 'high', category: 'patching', source: 'scanner', status: 'open', lastUpdated: '2h ago' },
      { id: 's2', title: 'MFA gap for admin tool', severity: 'critical', category: 'access', source: 'manual review', status: 'in progress', lastUpdated: '30m ago' },
      { id: 's3', title: 'Verbose logging in prod', severity: 'medium', category: 'monitoring', source: 'agent', status: 'resolved', lastUpdated: '1d ago' }
    ],
    upcoming: ['Patch cycle: Friday 23:00', 'Quarterly access audit: Mar 5', 'TLS certificate renewal: Mar 12']
  };
}

export async function getAgents(): Promise<Agent[]> {
  await delay();
  return [
    {
      id: 'a1',
      name: 'Content Strategist',
      description: 'Generates briefs and channel plans from campaign goals.',
      type: 'LLM agent',
      status: 'online',
      owner: 'Marketing Ops',
      metrics: { tasksToday: 34, avgDurationMinutes: 6, errorRate: 1.2, tokenUsage: 44200 },
      tags: ['content', 'planner'],
      configSummary: { model: 'gpt-4.1', endpoint: '/agents/content-strategist', scopes: ['content:write', 'analytics:read'] }
    },
    {
      id: 'a2',
      name: 'Workflow Recovery Bot',
      description: 'Retries and triages failed n8n workflows.',
      type: 'custom bot',
      status: 'degraded',
      owner: 'Automation Team',
      metrics: { tasksToday: 19, avgDurationMinutes: 4, errorRate: 6.8, tokenUsage: 12100 },
      tags: ['n8n', 'reliability'],
      configSummary: { model: 'claude-3.5-sonnet', endpoint: '/bots/recovery', scopes: ['workflows:read', 'workflows:retry'] }
    }
  ];
}

export async function getTokenUsage(): Promise<{ summaries: TokenUsageSummary[]; byProvider: { provider: string; tokens: number }[]; byAgent: { name: string; tokens: number; cost: number }[]; history: { day: string; tokens: number }[] }> {
  await delay();
  return {
    summaries: [
      { period: 'today', tokens: 182500, estimatedCost: 48.2, costPerSuccessfulTask: 0.39 },
      { period: 'week', tokens: 992100, estimatedCost: 242.4, costPerSuccessfulTask: 0.44 },
      { period: 'month', tokens: 4012300, estimatedCost: 1002.8, costPerSuccessfulTask: 0.47 }
    ],
    byProvider: [
      { provider: 'OpenAI', tokens: 2300000 },
      { provider: 'Anthropic', tokens: 1400000 },
      { provider: 'Local', tokens: 312300 }
    ],
    byAgent: [
      { name: 'Content Strategist', tokens: 44200, cost: 15.8 },
      { name: 'Workflow Recovery Bot', tokens: 12100, cost: 7.1 },
      { name: 'Lead Qualifier', tokens: 38100, cost: 12.4 },
      { name: 'SEO Publisher', tokens: 32900, cost: 10.2 },
      { name: 'Support Copilot', tokens: 27800, cost: 8.7 }
    ],
    history: [
      { day: 'Mon', tokens: 144000 },
      { day: 'Tue', tokens: 162000 },
      { day: 'Wed', tokens: 155000 },
      { day: 'Thu', tokens: 190000 },
      { day: 'Fri', tokens: 182500 }
    ]
  };
}

export async function getBusinessMetrics(): Promise<{ cards: Metric[]; trend: { week: string; leads: number; conversions: number }[] }> {
  await delay();
  return {
    cards: [
      { id: 'm1', label: 'AI-generated leads', value: '382', delta: '+8.2%', trend: 'up' },
      { id: 'm2', label: 'Conversion rate', value: '4.1%', delta: '+0.3%', trend: 'up' },
      { id: 'm3', label: 'Automation time saved', value: '116h', delta: '+12h', trend: 'up' },
      { id: 'm4', label: 'SLA met', value: '94%', delta: '-1.5%', trend: 'down' }
    ],
    trend: [
      { week: 'W1', leads: 290, conversions: 3.5 },
      { week: 'W2', leads: 310, conversions: 3.7 },
      { week: 'W3', leads: 345, conversions: 3.9 },
      { week: 'W4', leads: 382, conversions: 4.1 }
    ]
  };
}
