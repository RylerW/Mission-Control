export type TaskSource = 'agent' | 'bot' | 'n8n' | 'manual';
export type TaskStatus = 'success' | 'failed' | 'in-progress' | 'queued';

export interface Task {
  id: string;
  source: TaskSource;
  name: string;
  status: TaskStatus;
  startedAt: string;
  completedAt?: string;
  durationMinutes: number;
  costTokens?: number;
}

export type ContentStage = 'ideas' | 'drafting' | 'in-review' | 'scheduled' | 'published';
export type ContentType = 'blog' | 'video' | 'social' | 'email';

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  priority: 'low' | 'medium' | 'high';
  owner: string;
  targetDate: string;
  status: ContentStage;
  tags: string[];
}

export interface SecurityIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'patching' | 'configuration' | 'access' | 'network' | 'monitoring';
  source: 'scanner' | 'manual review' | 'script' | 'agent';
  status: 'open' | 'in progress' | 'resolved' | 'ignored';
  lastUpdated: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'LLM agent' | 'n8n workflow' | 'custom bot' | 'integration';
  status: 'online' | 'paused' | 'error' | 'maintenance' | 'degraded' | 'offline';
  owner: string;
  metrics: {
    tasksToday: number;
    avgDurationMinutes: number;
    errorRate: number;
    tokenUsage: number;
  };
  tags: string[];
  configSummary: {
    model: string;
    endpoint: string;
    scopes: string[];
  };
}

export interface TokenUsageSummary {
  period: 'today' | 'week' | 'month';
  tokens: number;
  estimatedCost: number;
  costPerSuccessfulTask: number;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  trend: 'up' | 'down' | 'neutral';
}
