import { cn } from '@/shared/lib/utils.ts';
import { DotIcon } from 'lucide-react';
import MarkDown from '@/widgets/markdown/markdown.tsx';
import { useUnit } from 'effector-react/effector-react.umd';
import { $headerHeight } from '@/widgets/header/model/store.ts';
import { useMemo } from 'react';
import { markdownSlug } from '@/widgets/markdown';
import { useObserveHashScroll } from '@/shared/hooks/use-observe-hash-scroll.ts';

type THeader = {
  id: string;
  title: string;
  margin: number;
};

export const DocsViewer = ({ docs }: { docs: string | null }) => {
  const [headerHeight] = useUnit([$headerHeight]);
  useObserveHashScroll();

  const headers = useMemo(() => {
    if (!docs) {
      return null;
    }

    return docs
      .split('\n')
      .filter(line => line.startsWith('#'))
      .map((header, index) => {
        const title = header.replaceAll('#', '').replaceAll('`', '').replaceAll('*', '').trim();

        return {
          id: `${index}-${markdownSlug(title)}`,
          title: title,
          margin: header.split(' ')[0].length,
        } as THeader;
      });
  }, [docs]);

  return (
    <div className={'h-fit flex flex-row gap-10 relative'}>
      {headers?.length && headers.length > 0 && (
        <div
          className={'w-[400px] h-full sticky flex flex-col gap-2'}
          style={{ top: `${headerHeight + 16}px` }}
        >
          <div
            className={
              'bg-border/30 rounded-lg p-4 max-h-[70vh] overflow-y-auto flex flex-col gap-1'
            }
          >
            {headers?.map(header => {
              return (
                <a
                  key={header.id}
                  href={`#${header.id}`}
                  className={cn(
                    'text-[10pt] font-thin flex flex-row items-center',
                    'hover:bg-foreground/5 rounded-sm',
                    'transition-all duration-200'
                  )}
                  style={{ paddingLeft: `${(header.margin - 1) * 16}px` }}
                >
                  <DotIcon />
                  {header.title}
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className={'flex-1 mx-auto'}>{docs && <MarkDown markDown={docs} />}</div>
    </div>
  );
};
