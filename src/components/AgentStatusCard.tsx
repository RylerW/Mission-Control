import { useEffect } from 'react';
import { agentAPI } from '../lib/n8n/agent';

export default function AgentStatusCard() {
  useEffect(() => {
    agentAPI.heartbeat().then((data) => {
      console.log('Agent Heartbeat:', data);
    });
  }, []);

  return <div>Agent Status Loaded... Check console</div>;
}
