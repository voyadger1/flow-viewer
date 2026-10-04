import { Spinner } from '@/shared/ui/spinner.tsx';

export const StatusRunning = () => (
  <div className={'aspect-square w-[16px] h-[16px] flex items-center justify-center rounded-full'}>
    <Spinner />
  </div>
);
