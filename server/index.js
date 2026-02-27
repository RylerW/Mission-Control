import { createServer } from 'node:http';
import { parse } from 'node:url';
import {
  createContentItem,
  getAgents,
  getBusinessMetrics,
  getContentItems,
  getDailyTasks,
  getOverviewSnapshot,
  getSecurityIssues,
  getTokenUsage,
  runAgentTask,
  toggleAgentStatus
} from './store.js';

const PORT = Number(process.env.PORT ?? 4000);

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(JSON.stringify(payload));
};

const readBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (!chunks.length) return {};

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
};

const server = createServer(async (req, res) => {
  try {
    if (!req.url || !req.method) {
      return sendJson(res, 400, { error: 'Malformed request' });
    }

    if (req.method === 'OPTIONS') {
      return sendJson(res, 204, {});
    }

    const parsed = parse(req.url, true);
    const path = parsed.pathname ?? '';

    if (path === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, { ok: true, service: 'mission-control-api' });
    }

    if (path === '/api/overview' && req.method === 'GET') {
      return sendJson(res, 200, getOverviewSnapshot());
    }

    if (path === '/api/tasks' && req.method === 'GET') {
      return sendJson(res, 200, getDailyTasks());
    }

    if (path === '/api/content' && req.method === 'GET') {
      return sendJson(res, 200, getContentItems());
    }

    if (path === '/api/content' && req.method === 'POST') {
      const body = await readBody(req);
      if (!body) {
        return sendJson(res, 400, { error: 'Invalid JSON body' });
      }
      if (!body.title || !body.type) {
        return sendJson(res, 400, { error: 'title and type are required' });
      }

      const item = createContentItem(body);
      return sendJson(res, 201, item);
    }

    if (path === '/api/security' && req.method === 'GET') {
      return sendJson(res, 200, getSecurityIssues());
    }

    if (path === '/api/agents' && req.method === 'GET') {
      return sendJson(res, 200, getAgents());
    }

    const toggleMatch = path.match(/^\/api\/agents\/([^/]+)\/toggle$/);
    if (toggleMatch && req.method === 'POST') {
      const agent = toggleAgentStatus(toggleMatch[1]);
      if (!agent) {
        return sendJson(res, 404, { error: 'Agent not found' });
      }

      return sendJson(res, 200, agent);
    }

    const runMatch = path.match(/^\/api\/agents\/([^/]+)\/run$/);
    if (runMatch && req.method === 'POST') {
      const agent = runAgentTask(runMatch[1]);
      if (!agent) {
        return sendJson(res, 404, { error: 'Agent not found' });
      }

      return sendJson(res, 200, agent);
    }

    if (path === '/api/tokens' && req.method === 'GET') {
      return sendJson(res, 200, getTokenUsage());
    }

    if (path === '/api/business-metrics' && req.method === 'GET') {
      return sendJson(res, 200, getBusinessMetrics());
    }

    return sendJson(res, 404, { error: 'Not found' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    console.error('API error:', message);
    return sendJson(res, 500, { error: message });
  }
});

server.listen(PORT, () => {
  console.log(`Mission Control API listening on http://localhost:${PORT}`);
});
