import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './layout/AppShell';
import { AgentsPage } from './features/agents/AgentsPage';
import { ContentPipelinePage } from './features/content-pipeline/ContentPipelinePage';
import { DailyReportsPage } from './features/daily-reports/DailyReportsPage';
import { BusinessMetricsPage } from './features/metrics/BusinessMetricsPage';
import { OverviewPage } from './features/overview/OverviewPage';
import { SecurityPage } from './features/security/SecurityPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { TokensPage } from './features/tokens/TokensPage';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/daily-reports" element={<DailyReportsPage />} />
        <Route path="/content-pipeline" element={<ContentPipelinePage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/tokens" element={<TokensPage />} />
        <Route path="/business-metrics" element={<BusinessMetricsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
