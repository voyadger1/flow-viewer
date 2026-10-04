import { XIcon } from 'lucide-react';

export const StatusFailed = () => (
  <div
    className={
      'bg-red-500 dark:bg-red-600 aspect-square w-[16px] h-[16px] flex items-center justify-center rounded-full'
    }
  >
    <XIcon size={10} color={'black'} strokeWidth={'4'} />
  </div>
);
