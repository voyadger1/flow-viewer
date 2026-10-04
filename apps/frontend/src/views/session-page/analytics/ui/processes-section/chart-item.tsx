import { Button } from '@/shared/ui/button.tsx';
import { Spinner } from '@/shared/ui/spinner.tsx';
import { DownloadIcon } from 'lucide-react';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/chart.tsx';
import {
  Area,
  AreaChart,
  CartesianGrid,
  type TooltipPayload,
  type TooltipPayloadEntry,
  XAxis,
  YAxis,
} from 'recharts';
import { useUnit } from 'effector-react';
import { $workflowProcessTelemetry } from '@/entities/telemetry';
import { useDivElementDownload } from '@/shared/hooks/use-div-element-download.ts';
import type {
  Formatter,
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { Skeleton } from '@/shared/ui/skeleton.tsx';

interface ChartItemProps {
  dataKey: string;
  title?: string;
  description?: string;
  color?: string;
  isLoading?: boolean;
  xTickFormatter?: (value: any, index: number) => string;
  yTickFormatter?: (value: any, index: number) => string;
  tooltipFormatter?: Formatter<ValueType, NameType> &
    ((
      value: ValueType,
      name: NameType,
      item: TooltipPayloadEntry,
      index: number,
      payload: TooltipPayload
    ) => React.ReactNode | [React.ReactNode, React.ReactNode]) &
    Formatter<ValueType, NameType>;
}

export const ChartItem = ({
  dataKey,
  title,
  description,
  color,
  isLoading,
  xTickFormatter,
  yTickFormatter,
  tooltipFormatter,
}: ChartItemProps) => {
  const [workflowProcessTelemetry] = useUnit([$workflowProcessTelemetry]);
  const {
    elementRef,
    handleDownload,
    isLoading: isLoadingDownload,
  } = useDivElementDownload({ fileName: dataKey });

  const chartConfig = {
    [dataKey]: {
      label: title ?? dataKey,
      color: color ?? '#d7eb25',
    },
  } satisfies ChartConfig;

  return isLoading ? (
    <Skeleton className="w-full h-[300px] rounded-lg" />
  ) : (
    <div
      className={
        'rounded-lg w-full h-fit border dark:bg-border/40 flex flex-col gap-2 items-center'
      }
    >
      <div className={'w-full flex flex-row p-3 border-b'}>
        <div className={'flex-1 flex flex-col'}>
          <span className={'text-[12pt] font-bold'}>{title ?? dataKey}</span>
          {description && <span className={'text-[10pt] text-foreground/50'}>{description}</span>}
        </div>
        <Button
          variant={'ghost'}
          className={'aspect-square h-8 w-8'}
          onClick={() => handleDownload()}
        >
          {isLoadingDownload ? <Spinner /> : <DownloadIcon />}
        </Button>
      </div>
      <div ref={elementRef} className={'w-full'}>
        <ChartContainer config={chartConfig} className="p-1 min-h-[200px] max-h-[300px] w-full">
          <AreaChart accessibilityLayer data={workflowProcessTelemetry}>
            <defs>
              <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={`var(--color-${dataKey})`} stopOpacity={0.8} />
                <stop offset="95%" stopColor={`var(--color-${dataKey})`} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid />
            <XAxis dataKey="runName" tickMargin={1} tickFormatter={xTickFormatter} />
            <YAxis tickFormatter={yTickFormatter} />
            <ChartTooltip content={<ChartTooltipContent formatter={tooltipFormatter} />} />
            <Area
              dataKey={dataKey}
              type="linear"
              fill={`url(#fill-${dataKey})`}
              stroke={`var(--color-${dataKey})`}
              stackId="a"
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};
