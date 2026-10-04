import { useEffect } from 'react';
import { $session } from '@/entities/session';
import { fetchProcessTelemetry, setProcessTelemetry } from '@/entities/telemetry';
import {
  $processSelectedId,
  fetchEdges,
  fetchProcesses,
  setProcessSelectedId,
} from '@/entities/processes';
import { FlowSection } from '@/views/session-page/flows/ui/flow-section.tsx';
import { useUnit } from 'effector-react/effector-react.umd';
import { LayoutSessionPage } from '@/views/session-page/ui/layout-session-page.tsx';
import { useSearchParams } from 'react-router-dom';

export const FlowsPage = () => {
  const [session, processSelectedId, fetchVerticesLoading, fetchEdgesLoading] = useUnit([
    $session,
    $processSelectedId,
    fetchProcesses.pending,
    fetchEdges.pending,
  ]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!session) {
      return;
    }

    setProcessSelectedId(null);

    fetchProcesses(session.id);
    fetchEdges(session.id);
  }, [session]);

  useEffect(() => {
    if (processSelectedId) {
      fetchProcessTelemetry(processSelectedId);
    } else {
      setProcessTelemetry(null);
      setProcessTelemetry(null);
    }
  }, [processSelectedId]);

  useEffect(() => {
    const processIdParam = searchParams.get('processId');
    if (!processIdParam) {
      return;
    }
    const processId = Number.parseInt(processIdParam);
    if (!isNaN(processId) && processId !== processSelectedId) {
      setProcessSelectedId(processId);
    }
  }, [searchParams, processSelectedId]);

  return (
    <LayoutSessionPage>
      {!fetchVerticesLoading && !fetchEdgesLoading && <FlowSection />}
    </LayoutSessionPage>
  );
};
