import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';

export function SettingsPage() {
  return (
    <>
      <SectionHeader title="Settings" description="Configuration placeholders for integrations and environment profiles." />
      <Card title="Integrations">
        <div className="space-y-2 text-sm text-slate-300">
          <p>Frontend API base URL: <code>VITE_API_BASE_URL</code> (optional).</p>
          <p>Default dev flow uses Vite proxy: <code>/api -&gt; http://localhost:4000</code>.</p>
          <p>Back end entrypoint is <code>server/index.js</code>. Replace in-memory store with your real agent and bot services.</p>
        </div>
      </Card>
    </>
  );
}
