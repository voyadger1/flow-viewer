import { Handle, type Node, type NodeProps, Position } from '@xyflow/react';
import { cn } from '@/shared/lib/utils.ts';
import { PROCESS_STATUSES } from '@/widgets/statuses/process-statuses.tsx';
import type { TProcessStatus, TVerticesType } from '@flowviewer/shared';
import { useSearchParams } from 'react-router-dom';

export type TProcessNode = {
  id?: number;
  label: string;
  type?: TVerticesType;
  status?: TProcessStatus;
  selected?: boolean;
  hideFrom?: boolean;
  hideTo?: boolean;
};

export const ProcessNode = ({ data }: NodeProps<Node<TProcessNode>>) => {
  const [, setSearchParams] = useSearchParams();

  return (
    <div
      className={cn(
        'px-2 py-1 rounded-sm border border-border bg-[#ffffff] dark:bg-[#333] text-foreground shadow-md',
        'flex flex-row gap-2 items-center',
        'transition-all duration-300',
        data?.selected &&
          'scale-105 shadow-[#000000aa] dark:shadow-[#ffffffaa] shadow-[0_0px_10px_-1px_rgba(0,0,0,0.1)]',
        data?.type !== 'PROCESS' && 'rounded-full bg-taupe-100 dark:bg-taupe-800',
        data?.type === 'OPERATOR' && 'bg-blue-100 dark:bg-blue-900'
      )}
      onClick={() => {
        if (!data?.id || isNaN(data?.id) || data?.type !== 'PROCESS') {
          return;
        }
        setSearchParams({
          processId: data.id?.toString(),
        });
      }}
    >
      {data?.type === 'PROCESS' && data?.status && PROCESS_STATUSES[data.status]}
      <span className="font-mono text-[10pt]">{data.label}</span>

      {!data.hideTo && <Handle type="source" position={Position.Right} />}
      {!data.hideFrom && <Handle type="target" position={Position.Left} />}
    </div>
  );
};
