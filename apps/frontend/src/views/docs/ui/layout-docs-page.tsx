import { Header } from '@/widgets/header/header.tsx';
import { BookHeartIcon, BookOpenIcon, MonitorCogIcon } from 'lucide-react';
import { buttonVariants } from '@/shared/ui/button.tsx';
import { type ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/shared/lib/utils.ts';
import { NextFlowIcon } from '@/shared/assets/icons';

interface LayoutSessionPageProps {
  children: ReactNode;
}

export const LayoutDocsPage = ({ children }: LayoutSessionPageProps) => {
  const location = useLocation();

  const pageName = useMemo(() => location.pathname.split('/').reverse()[0], [location.pathname]);

  return (
    <div className={'w-full flex flex-col gap-0 items-center'}>
      <Header
        BottomSection={
          <div className={'flex flex-row gap-1 mb-1'}>
            {(
              [
                {
                  children: (
                    <>
                      <BookHeartIcon /> About
                    </>
                  ),
                  src: `/docs/about`,
                  pageName: 'about',
                },
                {
                  children: (
                    <>
                      <MonitorCogIcon /> Web View
                    </>
                  ),
                  src: `/docs/web-view`,
                  pageName: 'web-view',
                },
                {
                  children: (
                    <>
                      <NextFlowIcon /> NextFlow plugin
                    </>
                  ),
                  src: `/docs/nf-plugin`,
                  pageName: 'nf-plugin',
                },
                {
                  children: (
                    <>
                      <BookOpenIcon /> API
                    </>
                  ),
                  src: `/docs/api`,
                  pageName: 'api',
                },
              ] as { children: ReactNode; src: string; pageName: string }[]
            )
              .filter(item => !!item)
              .map((value, index) => (
                <Link
                  key={index}
                  to={value.src}
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    value.pageName === pageName &&
                      'relative after:absolute after:-bottom-[6px] after:left-0 after:h-[2px] after:w-full after:bg-blue-600'
                  )}
                >
                  {value.children}
                </Link>
              ))}
          </div>
        }
      />
      <div className={'wrapper !mt-4'}>{children}</div>
    </div>
  );
};
