import { Agent, ContentItem, Metric, SecurityIssue, Task, TokenUsageSummary } from '../types/domain';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      },
      ...init
    });

    if (!response.ok) {
      const text = await response.text();
      let message = text || `API request failed with status ${response.status}`;
      try {
        const json = JSON.parse(text) as { error?: string };
        if (json.error) {
          message = json.error;
        }
      } catch {
        // Keep plain text fallback.
      }

      throw new Error(`${message} (${path})`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message} (${path})`);
    }
    throw new Error(`Unknown network error (${path})`);
  }
}

export function getOverviewSnapshot() {
  return request<{
    completedTasks: number;
    failedTasks: number;
    scheduledTasks: number;
    activeAgents: number;
    securityItemsToReview: number;
    pendingPatches: number;
    tokenToday: number;
    tokenBaseline: number;
    business: {
      revenue: string;
      leads: string;
      conversion: string;
    };
    sparkline: number[];
  }>('/api/overview');
}

export function getDailyTasks(): Promise<{ completed: Task[]; upcoming: Task[] }> {
  return request('/api/tasks');
}

export function getContentItems(): Promise<ContentItem[]> {
  return request('/api/content');
}

export function createContentIdea(payload: {
  title: string;
  type: ContentItem['type'];
  priority: ContentItem['priority'];
  owner: string;
  targetDate?: string;
  tags?: string[];
}): Promise<ContentItem> {
  return request('/api/content', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getSecurityIssues(): Promise<{ score: number; findings: SecurityIssue[]; upcoming: string[] }> {
  return request('/api/security');
}

export function getAgents(): Promise<Agent[]> {
  return request('/api/agents');
}

export function toggleAgentStatus(id: string): Promise<Agent> {
  return request(`/api/agents/${id}/toggle`, { method: 'POST' });
}

export function runAgentTask(id: string): Promise<Agent> {
  return request(`/api/agents/${id}/run`, { method: 'POST' });
}

export function getTokenUsage(): Promise<{
  summaries: TokenUsageSummary[];
  byProvider: { provider: string; tokens: number }[];
  byAgent: { name: string; tokens: number; cost: number }[];
  history: { day: string; tokens: number }[];
}> {
  return request('/api/tokens');
}

export function getBusinessMetrics(): Promise<{ cards: Metric[]; trend: { week: string; leads: number; conversions: number }[] }> {
  return request('/api/business-metrics');
}
