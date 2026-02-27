const state = {
  tasks: {
    completed: [
      { id: 't1', source: 'agent', name: 'Summarize client brief', status: 'success', startedAt: '09:00', completedAt: '09:08', durationMinutes: 8, costTokens: 1200 },
      { id: 't2', source: 'n8n', name: 'Publish weekly digest', status: 'failed', startedAt: '10:00', completedAt: '10:04', durationMinutes: 4, costTokens: 300 },
      { id: 't3', source: 'bot', name: 'Update CRM tags', status: 'success', startedAt: '10:40', completedAt: '10:49', durationMinutes: 9, costTokens: 520 }
    ],
    upcoming: [
      { id: 't4', source: 'manual', name: 'Approve ad copy', status: 'queued', startedAt: '14:00', durationMinutes: 0 },
      { id: 't5', source: 'agent', name: 'Generate landing page variants', status: 'queued', startedAt: '15:15', durationMinutes: 0 }
    ]
  },
  content: [
    { id: 'c1', title: 'AI onboarding checklist', type: 'blog', priority: 'high', owner: 'SEO Agent', targetDate: '2026-02-28', status: 'drafting', tags: ['onboarding', 'ai'] },
    { id: 'c2', title: 'Automation mythbusters reel', type: 'video', priority: 'medium', owner: 'Video Bot', targetDate: '2026-03-02', status: 'in-review', tags: ['social'] },
    { id: 'c3', title: 'Weekly product email', type: 'email', priority: 'high', owner: 'Growth Team', targetDate: '2026-02-27', status: 'scheduled', tags: ['retention'] }
  ],
  security: {
    score: 86,
    findings: [
      { id: 's1', title: 'Outdated OpenSSL package', severity: 'high', category: 'patching', source: 'scanner', status: 'open', lastUpdated: '2h ago' },
      { id: 's2', title: 'MFA gap for admin tool', severity: 'critical', category: 'access', source: 'manual review', status: 'in progress', lastUpdated: '30m ago' },
      { id: 's3', title: 'Verbose logging in prod', severity: 'medium', category: 'monitoring', source: 'agent', status: 'resolved', lastUpdated: '1d ago' }
    ],
    upcoming: ['Patch cycle: Friday 23:00', 'Quarterly access audit: Mar 5', 'TLS certificate renewal: Mar 12']
  },
  agents: [
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
  ],
  tokens: {
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
  },
  business: {
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
  }
};

const clone = (value) => JSON.parse(JSON.stringify(value));

export const getDailyTasks = () => clone(state.tasks);
export const getContentItems = () => clone(state.content);
export const getSecurityIssues = () => clone(state.security);
export const getAgents = () => clone(state.agents);
export const getTokenUsage = () => clone(state.tokens);
export const getBusinessMetrics = () => clone(state.business);

export const getOverviewSnapshot = () => {
  const completedTasks = state.tasks.completed.length;
  const failedTasks = state.tasks.completed.filter((task) => task.status === 'failed').length;
  const scheduledTasks = state.tasks.upcoming.length;
  const activeAgents = state.agents.filter((agent) => ['online', 'degraded'].includes(agent.status)).length;
  const securityItemsToReview = state.security.findings.filter((finding) => finding.status !== 'resolved').length;
  const pendingPatches = state.security.findings.filter((finding) => finding.category === 'patching' && finding.status !== 'resolved').length;
  const tokenToday = state.tokens.summaries.find((summary) => summary.period === 'today')?.tokens ?? 0;

  return {
    completedTasks,
    failedTasks,
    scheduledTasks,
    activeAgents,
    securityItemsToReview,
    pendingPatches,
    tokenToday,
    tokenBaseline: 160000,
    business: {
      revenue: '$42.3k',
      leads: '382',
      conversion: '4.1%'
    },
    sparkline: state.tokens.history.map((point) => Math.round(point.tokens / 4000))
  };
};

export const createContentItem = ({ title, type, priority = 'medium', owner = 'User', targetDate, tags = [] }) => {
  const allowedTypes = ['blog', 'video', 'social', 'email'];
  const allowedPriorities = ['low', 'medium', 'high'];
  if (!title || !String(title).trim()) {
    throw new Error('title is required');
  }
  if (!allowedTypes.includes(type)) {
    throw new Error('type must be one of: blog, video, social, email');
  }
  if (!allowedPriorities.includes(priority)) {
    throw new Error('priority must be one of: low, medium, high');
  }

  const item = {
    id: `c${Date.now()}`,
    title: String(title).trim(),
    type,
    priority,
    owner: owner && String(owner).trim() ? String(owner).trim() : 'User',
    targetDate: targetDate || new Date().toISOString().slice(0, 10),
    status: 'ideas',
    tags: Array.isArray(tags) ? tags : String(tags).split(',').map((tag) => tag.trim()).filter(Boolean)
  };

  state.content.unshift(item);
  return clone(item);
};

export const toggleAgentStatus = (id) => {
  const agent = state.agents.find((item) => item.id === id);
  if (!agent) return null;

  agent.status = agent.status === 'online' ? 'paused' : 'online';
  return clone(agent);
};

export const runAgentTask = (id) => {
  const agent = state.agents.find((item) => item.id === id);
  if (!agent) return null;

  agent.metrics.tasksToday += 1;
  const newTokens = 400 + Math.floor(Math.random() * 1200);
  agent.metrics.tokenUsage += newTokens;

  state.tasks.completed.unshift({
    id: `t${Date.now()}`,
    source: agent.type === 'custom bot' ? 'bot' : 'agent',
    name: `${agent.name}: manual run`,
    status: 'success',
    startedAt: new Date().toISOString().slice(11, 16),
    completedAt: new Date().toISOString().slice(11, 16),
    durationMinutes: 1 + Math.floor(Math.random() * 8),
    costTokens: newTokens
  });

  const todaySummary = state.tokens.summaries.find((summary) => summary.period === 'today');
  if (todaySummary) {
    todaySummary.tokens += newTokens;
  }

  const byAgent = state.tokens.byAgent.find((row) => row.name === agent.name);
  if (byAgent) {
    byAgent.tokens += newTokens;
    byAgent.cost = Number((byAgent.cost + newTokens / 3000).toFixed(2));
  }

  return clone(agent);
};
