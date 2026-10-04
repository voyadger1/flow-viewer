import type { ColumnDef } from '@tanstack/react-table';
import type { TSession } from '@flowviewer/shared';
import { Badge } from '@/shared/ui/badge.tsx';
import { CalendarDaysIcon, TimerIcon } from 'lucide-react';
import { PROCESS_STATUSES } from '@/widgets/statuses/process-statuses.tsx';
import { useEffect, useState } from 'react';
import { formatDuration } from '@/shared/lib/datetime.ts';
import { Link } from 'react-router-dom';
import type { TSessionsRequestDTO } from '@/entities/session/model/types.ts';
import { cn, getPositiveNumber } from '@/shared/lib/utils.ts';

interface ColumnProps {
  setFilter: (filter: keyof TSessionsRequestDTO, value?: string) => void;
}

export const Columns = ({ setFilter }: ColumnProps): ColumnDef<TSession>[] => {
  const [timeNow, setTimeNow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeNow(Date.now());

    return () => clearInterval(interval);
  }, []);

  return [
    {
      accessorKey: 'status',
      header: '',
      maxSize: 50,
      cell: ({ row }) => (
        <div className={'flex flex-row justify-end'}>
          {row.original.status && PROCESS_STATUSES[row.original.status]}
        </div>
      ),
    },
    {
      accessorKey: 'runName',
      header: 'Run Name',
      cell: ({ row }) => (
        <Link
          to={`/sessions/${row.original.id}/flow`}
          className={cn('text-[12px] font-mono hover:underline underline-offset-4')}
        >
          {row.original.runName}
        </Link>
      ),
    },
    {
      accessorKey: 'scriptName',
      header: 'Script Name',
      cell: ({ row }) => row.original.scriptName,
    },
    {
      accessorKey: 'envName',
      header: 'Run by',
      cell: ({ row }) =>
        row.original.runBy && (
          <Badge
            variant={'secondary'}
            onClick={() => row.original.runBy && setFilter('runBy', row.original.runBy)}
            className={'cursor-pointer'}
          >
            {row.original.runBy}
          </Badge>
        ),
    },
    {
      accessorKey: 'workflowName',
      header: 'WorkFlow',
      cell: ({ row }) => (
        <Badge
          variant={'secondary'}
          onClick={() =>
            row.original.workflowName && setFilter('workFlow', row.original.workflowName)
          }
          className={'cursor-pointer'}
        >
          {row.original.workflowName}
        </Badge>
      ),
    },
    {
      accessorKey: 'completedTime',
      header: 'Duration',
      cell: ({ row }) => (
        <div
          className={'flex flex-row gap-1 items-center text-[8pt] text-foreground/80 font-light'}
        >
          <TimerIcon size={14} />
          <span>
            {row.original.startTime &&
              row.original.completedTime &&
              formatDuration(
                getPositiveNumber(
                  Math.round(
                    (row.original.completedTime ? row.original.completedTime : timeNow) -
                      row.original.startTime
                  )
                )
              )}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'startTime',
      header: 'Start At',
      cell: ({ row }) => (
        <div
          className={'flex flex-row gap-1 items-center text-[8pt] text-foreground/80 font-light'}
        >
          <CalendarDaysIcon size={14} />
          <span>{row.original.startTime && new Date(row.original.startTime).toLocaleString()}</span>
        </div>
      ),
    },
  ];
};
