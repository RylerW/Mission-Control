import { Card } from '../../components/Card';
import { SectionHeader } from '../../components/SectionHeader';

export function SettingsPage() {
  return (
    <>
      <SectionHeader title="Settings" description="Configuration placeholders for integrations and environment profiles." />
      <Card title="Integrations">
        <p className="text-sm text-slate-300">Plug in n8n API keys, AI agent registry endpoints, security feeds, and token usage logs in /src/services when ready.</p>
      </Card>
    </>
  );
}
