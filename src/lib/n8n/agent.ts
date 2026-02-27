import { n8n } from './index';

export const agentAPI = {
  heartbeat: () =>
    n8n.post('/webhook/agent/heartbeat', {
      source: 'mission-control-ui',
      event: 'heartbeat',
      timestamp: new Date().toISOString(),
    }),

  restart: () => n8n.post('/webhook/agent/restart'),

  status: () => n8n.get('/webhook/agent/status'),
};
