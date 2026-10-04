import { ProcessesList } from './processes-list.tsx';
import { Flow } from '@/views/session-page/flows/ui/flow-section/flow.tsx';
import { useUnit } from 'effector-react';
import { $edges, $processes } from '@/entities/processes';
import { ReactFlowProvider } from '@xyflow/react';
import { $headerHeight } from '@/widgets/header/model/store.ts';
import { TelemetryTable } from './telemetry-table.tsx';
import { Button } from '@/shared/ui/button.tsx';
import { DownloadIcon } from 'lucide-react';
import { useReactFlowDownload } from '@/shared/hooks/use-react-flow-download.ts';

export const FlowSection = () => {
  const [nodesNF, edgesNF, headerHeight] = useUnit([$processes, $edges, $headerHeight]);
  const { handleDownload } = useReactFlowDownload();

  return (
    <div className={'w-full flex flex-row gap-4'}>
      <div className={'min-w-[300px] max-w-[300px] flex flex-col gap-4 relative'}>
        <div className={'sticky'} style={{ top: `${headerHeight + 16}px` }}>
          <ProcessesList />
        </div>
      </div>

      <div className={'flex-1 flex flex-col gap-4'}>
        <div className={'h-[400px] border rounded-lg overflow-hidden'}>
          <ReactFlowProvider>
            {nodesNF && edgesNF && <Flow nodesNF={nodesNF} edgesNF={edgesNF} />}
          </ReactFlowProvider>
        </div>

        <Button variant={'ghost'} onClick={() => handleDownload()}>
          <DownloadIcon /> Download Flow IMG
        </Button>

        <TelemetryTable />
      </div>
    </div>
  );
};
