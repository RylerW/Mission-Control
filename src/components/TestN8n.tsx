import { useEffect } from 'react';

export default function TestN8n() {
  useEffect(() => {
    fetch('/n8n/webhook/agent/heartbeat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'mission-control-ui',
        event: 'heartbeat',
        timestamp: new Date().toISOString()
      })
    })
      .then(async (r) => {
        const text = await r.text();
        let data: unknown = text;
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          // Keep raw text payload.
        }

        if (!r.ok) {
          console.error('Heartbeat Error:', r.status, data);
          return;
        }

        console.log('Heartbeat Response:', data);
      })
      .catch((err) => console.error('Error:', err));
  }, []);

  return (
    <div>
      <h2>Testing n8n Connection...</h2>
      <p>Check your console.</p>
    </div>
  );
}
