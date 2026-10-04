import type { ColumnDef } from '@tanstack/react-table';
import { EyeIcon, FileTextIcon, MinusIcon } from 'lucide-react';
import type { TArtifact, TProcess } from '@flowviewer/shared';
import { cn, formatBytes } from '@/shared/lib/utils.ts';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '@/shared/ui/button.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip.tsx';

interface ColumnsProps {
  processes?: TProcess[] | null;
  onArtifactSelected?: (artifact: TArtifact) => void;
}

export const Columns = ({
  processes,
  onArtifactSelected,
}: ColumnsProps): ColumnDef<TArtifact>[] => {
  const ProcessBtn = (process?: TProcess) => {
    if (!process) {
      return <MinusIcon />;
    }
    return (
      <Link
        to={`/sessions/${process.sessionId}/flow?processId=${process.id}`}
        className={cn(buttonVariants({ variant: 'secondary' }))}
      >
        {process.label}
      </Link>
    );
  };

  return [
    {
      accessorKey: 'name',
      header: 'Name',
      maxSize: 50,
      cell: ({ row }) => (
        <div className={'flex flex-row items-center gap-1'}>
          <FileTextIcon size={14} /> {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: 'size',
      header: 'Size',
      maxSize: 50,
      cell: ({ row }) => formatBytes(row.original.size, 0),
    },
    {
      accessorKey: 'permissions',
      header: 'Permissions',
      maxSize: 50,
      cell: ({ row }) =>
        row.original.permissions && <span className={'font-mono'}>{row.original.permissions}</span>,
    },
    {
      accessorKey: 'fileSystem',
      header: 'File System',
      maxSize: 50,
      cell: ({ row }) => row.original.fileSystem,
    },
    {
      accessorKey: 'uri',
      header: 'URI',
      maxSize: 50,
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger
            render={<div className={'max-w-[20vw] overflow-x-auto'}>{row.original.uri}</div>}
          />
          <TooltipContent className={'max-w-[50vw]'}>
            <p>{row.original.uri}</p>
          </TooltipContent>
        </Tooltip>
      ),
      size: 300,
    },
    {
      accessorKey: 'processId',
      header: 'Process',
      maxSize: 50,
      cell: ({ row }) =>
        ProcessBtn(
          row.original.processId
            ? processes?.find(process => process.id === row.original.processId)
            : undefined
        ),
      size: 300,
    },
    {
      accessorKey: 'data',
      header: 'Data',
      maxSize: 50,
      cell: ({ row }) =>
        row.original.data && (
          <Button onClick={() => row.original && onArtifactSelected?.(row.original)}>
            <EyeIcon /> View Data
          </Button>
        ),
      size: 300,
    },
  ];
};
