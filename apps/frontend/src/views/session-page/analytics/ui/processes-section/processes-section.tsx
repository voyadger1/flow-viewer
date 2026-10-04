import { Button } from '@/shared/ui/button.tsx';
import { useUnit } from 'effector-react';
import { $session } from '@/entities/session';
import {
  $workflowProcesses,
  fetchWorkflowProcesses,
  fetchWorkflowProcessTelemetry,
} from '@/entities/telemetry';
import { useEffect, useState } from 'react';
import { $headerHeight } from '@/widgets/header/model/store.ts';
import { ChartItem } from '@/views/session-page/analytics/ui/processes-section/chart-item.tsx';
import { formatBytes } from '@/shared/lib/utils.ts';
import { formatDuration } from '@/shared/lib/datetime.ts';
import { Skeleton } from '@/shared/ui/skeleton.tsx';

export const ProcessesSection = () => {
  const [
    session,
    workflowProcesses,
    headerHeight,
    loadingWorkflowProcesses,
    loadingWorkflowProcessTelemetry,
  ] = useUnit([
    $session,
    $workflowProcesses,
    $headerHeight,
    fetchWorkflowProcesses.pending,
    fetchWorkflowProcessTelemetry.pending,
  ]);
  const [processSelected, setProcessSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !session.workflowName) {
      return;
    }

    fetchWorkflowProcesses(session.workflowName);
  }, [session]);

  useEffect(() => {
    if (workflowProcesses && workflowProcesses.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProcessSelected(workflowProcesses[0]);
    }
  }, [workflowProcesses]);

  useEffect(() => {
    if (!processSelected || !session || !session.workflowName) {
      return;
    }

    fetchWorkflowProcessTelemetry({ workflow: session.workflowName, processName: processSelected });
  }, [processSelected]);

  return (
    <div className={'flex flex-row gap-4'}>
      <div className={'relative'}>
        {loadingWorkflowProcesses ? (
          <Skeleton className="max-w-[30vw] w-[15vw] h-[300px] rounded-lg" />
        ) : (
          <div
            className={'sticky flex flex-col max-w-[30vw] w-[15vw] gap-2'}
            style={{ top: `${headerHeight + 16}px` }}
          >
            <span className={'text-foreground/50 font-thin'}>
              All processes for workflow {session?.workflowName}
            </span>
            <hr />

            <div className={'flex flex-col max-h-[60vh] overflow-y-auto'}>
              {workflowProcesses.map(processe => (
                <Button
                  key={processe}
                  variant={processe === processSelected ? 'secondary' : 'ghost'}
                  onClick={() => setProcessSelected(processe)}
                >
                  {processe}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={'flex-1 flex flex-col gap-4'}>
        <ChartItem
          dataKey={'realtime'}
          color={'#2563eb'}
          title={'Realtime'}
          description={'Execution time'}
          yTickFormatter={value => formatDuration(Number.parseInt(value.toString()))}
          tooltipFormatter={value => {
            return value && formatDuration(Number.parseInt(value?.toString()));
          }}
          isLoading={loadingWorkflowProcessTelemetry}
        />

        <ChartItem
          dataKey={'cpuPercent'}
          color={'#25eb81'}
          title={'CPU Percent'}
          description={'Average CPU usage percentage over the entire duration of the task'}
          tooltipFormatter={value => {
            return value && `${value}%`;
          }}
          isLoading={loadingWorkflowProcessTelemetry}
        />

        <div className={'flex flex-row gap-4'}>
          <ChartItem
            dataKey={'peakRss'}
            color={'#d7eb25'}
            title={'Peak Rss'}
            description={'Peak RSS value for the entire duration of the task'}
            xTickFormatter={value => value.slice(0, 30)}
            yTickFormatter={value => formatBytes(Number.parseInt(value.toString()))}
            tooltipFormatter={value => {
              return value && formatBytes(Number.parseInt(value?.toString()));
            }}
            isLoading={loadingWorkflowProcessTelemetry}
          />

          <ChartItem
            dataKey={'peakVmem'}
            color={'#ebbd25'}
            title={'Peak Vmem'}
            description={'Peak VMEM value for the entire duration of the task'}
            xTickFormatter={value => value.slice(0, 30)}
            yTickFormatter={value => formatBytes(Number.parseInt(value.toString()))}
            tooltipFormatter={value => {
              return value && formatBytes(Number.parseInt(value?.toString()));
            }}
            isLoading={loadingWorkflowProcessTelemetry}
          />
        </div>

        <div className={'flex flex-row gap-4'}>
          <ChartItem
            dataKey={'rchar'}
            color={'#6725eb'}
            title={'Read Chars'}
            description={'Data read via system calls'}
            xTickFormatter={value => value.slice(0, 30)}
            yTickFormatter={value => formatBytes(Number.parseInt(value.toString()))}
            tooltipFormatter={value => {
              return value && formatBytes(Number.parseInt(value?.toString()));
            }}
            isLoading={loadingWorkflowProcessTelemetry}
          />

          <ChartItem
            dataKey={'wchar'}
            color={'#a925eb'}
            title={'Write Chars'}
            description={'Data written via system calls'}
            xTickFormatter={value => value.slice(0, 30)}
            yTickFormatter={value => formatBytes(Number.parseInt(value.toString()))}
            tooltipFormatter={value => {
              return value && formatBytes(Number.parseInt(value?.toString()));
            }}
            isLoading={loadingWorkflowProcessTelemetry}
          />
        </div>

        <div className={'flex flex-row gap-4'}>
          <ChartItem
            dataKey={'readBytes'}
            color={'#25ebbd'}
            title={'Read Bytes'}
            description={'Data read from disk (actual I/O)'}
            xTickFormatter={value => value?.slice(0, 30)}
            yTickFormatter={value => value && formatBytes(Number.parseInt(value.toString()))}
            tooltipFormatter={value => {
              return value && formatBytes(Number.parseInt(value?.toString()));
            }}
            isLoading={loadingWorkflowProcessTelemetry}
          />

          <ChartItem
            dataKey={'writeBytes'}
            color={'#2588eb'}
            title={'Write Bytes'}
            description={'Data written to disk (actual I/O)'}
            xTickFormatter={value => value?.slice(0, 30)}
            yTickFormatter={value => value && formatBytes(Number.parseInt(value.toString()))}
            tooltipFormatter={value => {
              return value && formatBytes(Number.parseInt(value?.toString()));
            }}
            isLoading={loadingWorkflowProcessTelemetry}
          />
        </div>
      </div>
    </div>
  );
};
