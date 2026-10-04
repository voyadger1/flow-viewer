import { useUnit } from 'effector-react';
import { $processes, $processSelectedId } from '@/entities/processes';
import { useEffect, useMemo, useState } from 'react';
import { PROCESS_STATUSES } from '@/widgets/statuses/process-statuses.tsx';
import { formatDuration } from '@/shared/lib/datetime.ts';
import { cn } from 'cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip.tsx';
import type { TProcess, TProcessStatus } from '@flowviewer/shared';
import { getPositiveNumber } from '@/shared/lib/utils.ts';
import { useSearchParams } from 'react-router-dom';

const ProcessItem = ({ process }: { process: TProcess }) => {
  const [processSelectedId] = useUnit([$processSelectedId]);
  const [timeNow, setTimeNow] = useState(0);
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeNow(Date.now());

    return () => clearInterval(interval);
  }, []);

  const timing = useMemo(() => {
    if (!process.startTime) {
      return '';
    }

    const completeTime = process.completeTime ? process.completeTime : timeNow;

    return formatDuration(getPositiveNumber(Math.round(completeTime - process.startTime)));
  }, [process, timeNow]);

  const handleClick = () => {
    setSearchParams({
      processId: process.id.toString(),
    });
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'w-full flex flex-row gap-2 items-center p-1 rounded-sm',
        'cursor-pointer hover:bg-foreground/5',
        processSelectedId === process.id && 'bg-border/50 outline'
      )}
    >
      {PROCESS_STATUSES[process.status]}

      <div className={'flex-1 overflow-hidden'}>
        <Tooltip>
          <TooltipTrigger>
            <span
              className={cn(
                'cursor-pointer w-full font-mono text-[10pt] flex-1 overflow-hidden whitespace-nowrap text-ellipsis'
              )}
            >
              {process.label}
            </span>
          </TooltipTrigger>
          <TooltipContent>{process.label}</TooltipContent>
        </Tooltip>
      </div>

      {(['RUNNING', 'SUCCEEDED', 'CACHED', 'FAILED'] as TProcessStatus[]).includes(
        process.status
      ) &&
        process.startTime && <span className={'ml-4 text-[8pt] text-foreground/50'}>{timing}</span>}
    </div>
  );
};

export const ProcessesList = () => {
  const [processes] = useUnit([$processes]);

  return (
    <div className={'w-full flex flex-col gap-4'}>
      <span className={'text-foreground/50 font-thin'}>All processes</span>
      <hr />
      <div className={'flex flex-col gap-1 max-h-[65vh] overflow-y-auto p-1'}>
        {processes?.length ? (
          processes
            .filter(vertex => vertex.type === 'PROCESS')
            .map(vertex => <ProcessItem key={vertex.id} process={vertex} />)
        ) : (
          <span className={'font-thin'}>...</span>
        )}
      </div>
    </div>
  );
};
