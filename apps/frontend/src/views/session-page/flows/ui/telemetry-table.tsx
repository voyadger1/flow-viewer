import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table.tsx';
import { useUnit } from 'effector-react';
import { $processTelemetry } from '@/entities/telemetry';
import { type ReactNode, useMemo } from 'react';
import type { TProcessTelemetry } from '@flowviewer/shared';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible.tsx';
import { Button } from '@/shared/ui/button.tsx';
import {
  ChevronsUpDown,
  CpuIcon,
  DatabaseIcon,
  MinusIcon,
  PlayIcon,
  TablePropertiesIcon,
} from 'lucide-react';
import { DockerIcon } from '@/shared/assets/icons';
import { formatBytes } from '@/shared/lib/utils.ts';
import { formatDuration } from '@/shared/lib/datetime.ts';

type TDataRowKey = keyof TProcessTelemetry;

const rowsDescription: Record<TDataRowKey, string> = {
  processId: 'ID процессаs',
  realtime: 'Execution time',
  container: 'Docker image',
  module: 'Environment modules (for HPC)',
  hash: 'Task hash (used for the -resume cache)',
  cpuPercent: 'Average CPU usage percentage over the entire duration of the task',
  mem: 'Percentage of allocated memory used',
  rss: 'Resident Set Size — physical memory',
  vmem: 'Virtual Memory — virtual memory',
  peakRss: 'Peak RSS value for the entire duration of the task',
  peakVmem: 'Peak VMEM value for the entire duration of the task',
  rchar: 'Data read via system calls',
  wchar: 'Data written via system calls',
  readBytes: 'Data read from disk (actual I/O)',
  writeBytes: 'Data written to disk (actual I/O)',
  exitStatus: 'Process exit code',
  startTime: 'Start time',
  completeTime: 'Completion time',
  cpu_model: 'CPU model',
  hostname: 'Hostname',
  inv_ctxt: 'Номер invocation context (for retries)',
  vol_ctxt: 'Volunteer context number (for dynamic tasks)',
  error_action: 'Action on error (retry, ignore, terminate)',
  disk: 'Disk limit',
  memory: 'Memory limit from the memory directive',
  cpus: 'Number of CPUs requested (cpus directive)',
  queue: 'Scheduler queue (SLURM partition, SGE queue)',
  scratch: 'Scratch directory',
};

export const TelemetryTable = () => {
  const [processTelemetry] = useUnit([$processTelemetry]);

  type TRowTelemetry = {
    title?: TDataRowKey;
    description?: string;
    data?: ReactNode;
  };

  const columnsProperties: TRowTelemetry[] = useMemo(() => {
    if (!processTelemetry) {
      return [];
    }

    return [
      {
        title: 'realtime',
        description: rowsDescription['realtime'],
        data: processTelemetry.realtime && formatDuration(processTelemetry.realtime),
      },
      {
        title: 'hash',
        description: rowsDescription['hash'],
        data: processTelemetry.hash,
      },
      {
        title: 'startTime',
        description: rowsDescription['startTime'],
        data: processTelemetry.startTime && new Date(processTelemetry.startTime).toLocaleString(),
      },
      {
        title: 'completeTime',
        description: rowsDescription['completeTime'],
        data:
          processTelemetry.completeTime && new Date(processTelemetry.completeTime).toLocaleString(),
      },
      {
        title: 'hostname',
        description: rowsDescription['hostname'],
        data: processTelemetry.hostname,
      },
    ];
  }, [processTelemetry]);

  const columnsMemory: TRowTelemetry[] = useMemo(() => {
    if (!processTelemetry) {
      return [];
    }

    return [
      {
        title: 'mem',
        description: rowsDescription['mem'],
        data: processTelemetry.mem && `${processTelemetry.mem}%`,
      },
      {
        title: 'rss',
        description: rowsDescription['rss'],
        data: processTelemetry.rss && formatBytes(processTelemetry.rss),
      },
      {
        title: 'vmem',
        description: rowsDescription['vmem'],
        data: processTelemetry.vmem && formatBytes(processTelemetry.vmem),
      },
      {
        title: 'peakRss',
        description: rowsDescription['peakRss'],
        data: processTelemetry.peakRss && formatBytes(processTelemetry.peakRss),
      },
      {
        title: 'peakVmem',
        description: rowsDescription['peakVmem'],
        data: processTelemetry.peakVmem && formatBytes(processTelemetry.peakVmem),
      },
      {
        title: 'rchar',
        description: rowsDescription['rchar'],
        data: processTelemetry.rchar && formatBytes(processTelemetry.rchar),
      },
      {
        title: 'wchar',
        description: rowsDescription['wchar'],
        data: processTelemetry.wchar && formatBytes(processTelemetry.wchar),
      },
      {
        title: 'readBytes',
        description: rowsDescription['readBytes'],
        data: processTelemetry.readBytes && formatBytes(processTelemetry.readBytes),
      },
      {
        title: 'writeBytes',
        description: rowsDescription['writeBytes'],
        data: processTelemetry.writeBytes && formatBytes(processTelemetry.writeBytes),
      },
      {
        title: 'disk',
        description: rowsDescription['disk'],
        data: processTelemetry.disk,
      },
      {
        title: 'memory',
        description: rowsDescription['memory'],
        data: processTelemetry.memory,
      },
    ];
  }, [processTelemetry]);

  const columnsCPU: TRowTelemetry[] = useMemo(() => {
    if (!processTelemetry) {
      return [];
    }

    return [
      {
        title: 'cpuPercent',
        description: rowsDescription['cpuPercent'],
        data: processTelemetry.cpuPercent && `${processTelemetry.cpuPercent}%`,
      },
      {
        title: 'cpu_model',
        description: rowsDescription['cpu_model'],
        data: processTelemetry.cpu_model,
      },
      {
        title: 'cpus',
        description: rowsDescription['cpus'],
        data: processTelemetry.cpus,
      },
    ];
  }, [processTelemetry]);

  const columnsRun: TRowTelemetry[] = useMemo(() => {
    if (!processTelemetry) {
      return [];
    }

    return [
      {
        title: 'container',
        description: rowsDescription['container'],
        data: processTelemetry.container && (
          <div className={'flex flex-row gap-2 items-start justify-end'}>
            <DockerIcon className={'mt-1'} />
            {processTelemetry.container}
          </div>
        ),
      },
      {
        title: 'module',
        description: rowsDescription['module'],
        data: processTelemetry.module,
      },
      {
        title: 'exitStatus',
        description: rowsDescription['exitStatus'],
        data: processTelemetry.exitStatus,
      },
      {
        title: 'inv_ctxt',
        description: rowsDescription['inv_ctxt'],
        data: processTelemetry.inv_ctxt,
      },
      {
        title: 'vol_ctxt',
        description: rowsDescription['vol_ctxt'],
        data: processTelemetry.vol_ctxt,
      },
      {
        title: 'error_action',
        description: rowsDescription['error_action'],
        data: processTelemetry.error_action,
      },
      {
        title: 'queue',
        description: rowsDescription['queue'],
        data: processTelemetry.queue,
      },
      {
        title: 'scratch',
        description: rowsDescription['scratch'],
        data: processTelemetry.scratch,
      },
    ];
  }, [processTelemetry]);

  return processTelemetry ? (
    <div className={'flex flex-col gap-4'}>
      <Collapsible className="flex w-full flex-col gap-2 bg-border/30 p-2 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" className="w-full text-start flex justify-start p-4">
                <TablePropertiesIcon />
                <span>Properties</span>
                <ChevronsUpDown />
              </Button>
            }
          />
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <Table>
            {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Row</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columnsProperties.map((column, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{column.title}</TableCell>
                  <TableCell>{column.description}</TableCell>
                  <TableCell className="text-right">
                    {column.data || <MinusIcon className={'ml-auto'} strokeWidth={1} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="flex w-full flex-col gap-2 bg-border/30 p-2 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" className="w-full text-start flex justify-start p-4">
                <DatabaseIcon />
                <span>Memory</span>
                <ChevronsUpDown />
              </Button>
            }
          />
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <Table>
            {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Row</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columnsMemory.map((column, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{column.title}</TableCell>
                  <TableCell>{column.description}</TableCell>
                  <TableCell className="text-right">
                    {column.data || <MinusIcon className={'ml-auto'} strokeWidth={1} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="flex w-full flex-col gap-2 bg-border/30 p-2 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" className="w-full text-start flex justify-start p-4">
                <CpuIcon />
                <span>CPU</span>
                <ChevronsUpDown />
              </Button>
            }
          />
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <Table>
            {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Row</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columnsCPU.map((column, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{column.title}</TableCell>
                  <TableCell>{column.description}</TableCell>
                  <TableCell className="text-right">
                    {column.data || <MinusIcon className={'ml-auto'} strokeWidth={1} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="flex w-full flex-col gap-2 bg-border/30 p-2 rounded-lg">
        <div className="flex items-center justify-between gap-4">
          <CollapsibleTrigger
            render={
              <Button variant="ghost" className="w-full text-start flex justify-start p-4">
                <PlayIcon />
                <span>Run</span>
                <ChevronsUpDown />
              </Button>
            }
          />
        </div>
        <CollapsibleContent className="flex flex-col gap-2">
          <Table>
            {/*<TableCaption>A list of your recent invoices.</TableCaption>*/}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Row</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columnsRun.map((column, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{column.title}</TableCell>
                  <TableCell>{column.description}</TableCell>
                  <TableCell className="text-right">
                    {column.data || <MinusIcon className={'ml-auto'} strokeWidth={1} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ) : (
    <></>
  );
};
