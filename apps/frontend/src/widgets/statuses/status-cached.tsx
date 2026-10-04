import { LayersIcon } from 'lucide-react';

export const StatusCached = () => (
  <div
    className={
      'bg-green-600 aspect-square w-[16px] h-[16px] flex items-center justify-center rounded-full'
    }
  >
    <LayersIcon size={10} color={'black'} strokeWidth={'3'} />
  </div>
);
