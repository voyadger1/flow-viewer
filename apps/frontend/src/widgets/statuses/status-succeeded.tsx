import { CheckIcon } from 'lucide-react';

export const StatusSucceeded = () => (
  <div
    className={
      'bg-green-500 dark:bg-green-600 aspect-square w-[16px] h-[16px] flex items-center justify-center rounded-full'
    }
  >
    <CheckIcon size={10} color={'black'} strokeWidth={'4'} />
  </div>
);
