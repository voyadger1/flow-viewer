import type { ColumnDef } from '@tanstack/react-table';
import type { TProcess, TProcessTelemetry } from '@flowviewer/shared';
import { MinusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatBytes } from '@/shared/lib/utils.ts';
import { buttonVariants } from '@/shared/ui/button.tsx';
import { formatDuration } from '@/shared/lib/datetime.ts';
import { Badge } from '@/shared/ui/badge.tsx';

interface ColumnProps {
  processes: TProcess[] | null;
}

export const Columns = ({ processes }: ColumnProps): ColumnDef<TProcessTelemetry>[] => {
  const ProcessBtn = (process?: TProcess) => {
    if (!process) {
      return <MinusIcon />;
    }
    return (
      <Link
        to={`/sessions/${process.sessionId}/flow?processId=${process.id}`}
        className={cn(buttonVariants({ variant: 'secondary' }), 'h-7 text-[8pt]')}
      >
        {process.label}
      </Link>
    );
  };

  const ExitStatus = ({ exitStatus }: { exitStatus?: number }) => {
    if (exitStatus === 0) {
      return <Badge variant={'success'}>success</Badge>;
    }
    if (exitStatus !== 0) {
      return <Badge variant={'destructive'}>error</Badge>;
    }
    return <></>;
  };

  return [
    {
      accessorKey: 'processId',
      header: 'Process',
      maxSize: 50,
      cell: ({ row }) =>
        ProcessBtn(processes?.find(process => process.id === row.original.processId)),
    },
    {
      accessorKey: 'container',
      header: 'Container',
      maxSize: 50,
      cell: ({ row }) => row.original.container,
    },
    {
      accessorKey: 'exitStatus',
      header: 'Exit Status',
      maxSize: 50,
      cell: ({ row }) => <ExitStatus exitStatus={row.original.exitStatus} />,
    },

    {
      accessorKey: 'realtime',
      header: 'Realtime',
      maxSize: 50,
      cell: ({ row }) => row.original.realtime && formatDuration(row.original.realtime),
    },
    {
      accessorKey: 'hostname',
      header: 'Host Name',
      maxSize: 50,
      cell: ({ row }) => row.original.hostname,
    },
    {
      accessorKey: 'mem',
      header: 'MEM',
      maxSize: 50,
      cell: ({ row }) => row.original.mem && `${row.original.mem}%`,
    },
    {
      accessorKey: 'rss',
      header: 'RSS',
      maxSize: 50,
      cell: ({ row }) => row.original.rss && formatBytes(row.original.rss),
    },
    {
      accessorKey: 'vmem',
      header: 'VMEM',
      maxSize: 50,
      cell: ({ row }) => row.original.vmem && formatBytes(row.original.vmem),
    },
    {
      accessorKey: 'peakRss',
      header: 'Peak RSS',
      maxSize: 50,
      cell: ({ row }) => row.original.peakRss && formatBytes(row.original.peakRss),
    },
    {
      accessorKey: 'peakVmem',
      header: 'Peak VMEM',
      maxSize: 50,
      cell: ({ row }) => row.original.peakVmem && formatBytes(row.original.peakVmem),
    },
    {
      accessorKey: 'rchar',
      header: 'Read Char',
      maxSize: 50,
      cell: ({ row }) => row.original.rchar && formatBytes(row.original.rchar),
    },
    {
      accessorKey: 'wchar',
      header: 'Write Char',
      maxSize: 50,
      cell: ({ row }) => row.original.wchar && formatBytes(row.original.wchar),
    },
    {
      accessorKey: 'readBytes',
      header: 'Read Bytes',
      maxSize: 50,
      cell: ({ row }) => row.original.readBytes && formatBytes(row.original.readBytes),
    },
    {
      accessorKey: 'writeBytes',
      header: 'Write Bytes',
      maxSize: 50,
      cell: ({ row }) => row.original.writeBytes && formatBytes(row.original.writeBytes),
    },
    {
      accessorKey: 'disk',
      header: 'Disk Limit',
      maxSize: 50,
      cell: ({ row }) => row.original.disk && formatBytes(row.original.disk),
    },
    {
      accessorKey: 'memory',
      header: 'Memory Limit',
      maxSize: 50,
      cell: ({ row }) => row.original.memory && formatBytes(row.original.memory),
    },
    {
      accessorKey: 'cpuPercent',
      header: 'CPU Percent',
      maxSize: 50,
      cell: ({ row }) => row.original.cpuPercent && `${row.original.cpuPercent}%`,
    },
    {
      accessorKey: 'cpu_model',
      header: 'CPU Model',
      maxSize: 50,
      cell: ({ row }) => row.original.cpu_model,
    },
    {
      accessorKey: 'cpus',
      header: 'CPUS',
      maxSize: 50,
      cell: ({ row }) => row.original.cpus,
    },
  ];
};
