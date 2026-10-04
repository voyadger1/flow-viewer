import { LayoutSessionPage } from '@/views/session-page/ui/layout-session-page.tsx';
import { TelemetrySection } from './ui/telemetry-section/telemetry-section.tsx';
import { ProcessesSection } from './ui/processes-section/processes-section.tsx';

export const AnalyticsPage = () => {
  return (
    <LayoutSessionPage>
      <div className={'flex flex-col gap-4'}>
        <TelemetrySection />
        <ProcessesSection />
      </div>
    </LayoutSessionPage>
  );
};
