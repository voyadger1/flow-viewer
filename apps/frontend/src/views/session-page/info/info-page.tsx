import { LayoutSessionPage } from '@/views/session-page/ui/layout-session-page.tsx';
import { useUnit } from 'effector-react/effector-react.umd';
import { $session } from '@/entities/session';
import MarkDown from '@/widgets/markdown/markdown.tsx';
import { useMemo } from 'react';
import { markdownSlug } from '@/widgets/markdown';
import { $headerHeight } from '@/widgets/header/model/store.ts';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { ArrowUpRightIcon, BookOpenTextIcon, DotIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button.tsx';
import { cn } from '@/shared/lib/utils.ts';

type THeader = {
  id: string;
  title: string;
  margin: number;
};

export const InfoPage = () => {
  const [session, headerHeight] = useUnit([$session, $headerHeight]);

  const headers = useMemo(() => {
    if (!session?.sessionInfo) {
      return null;
    }

    return session.sessionInfo
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
  }, [session]);

  const infoMdName = useMemo(() => {
    return session?.scriptName?.replace(/\.[^.]+$/, '.md');
  }, [session]);

  return (
    <LayoutSessionPage>
      {session?.sessionInfo ? (
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

          <div className={'flex-1 mx-auto'}>
            <MarkDown markDown={session.sessionInfo} />
          </div>
        </div>
      ) : (
        <Empty className={'mt-[20vh]'}>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpenTextIcon />
            </EmptyMedia>
            <EmptyTitle>No description yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created a project description yet. Create a{' '}
              <span className={'font-mono text-foreground'}>{infoMdName}</span> or{' '}
              <span className={'font-mono text-foreground'}>README.md</span> file.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            variant="link"
            className="text-muted-foreground"
            size="sm"
            nativeButton={false}
            render={
              <a href="#">
                Learn More <ArrowUpRightIcon />
              </a>
            }
          />
        </Empty>
      )}
    </LayoutSessionPage>
  );
};
