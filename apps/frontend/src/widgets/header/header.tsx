import { type ReactNode, useCallback, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils.ts';
import { $headerHeight, setHeaderHeight } from '@/widgets/header/model/store.ts';
import { useUnit } from 'effector-react';
import { Button } from '@/shared/ui/button.tsx';
import { useTheme } from '@/shared/ui/theme-provider.tsx';
import { MoonIcon, SunIcon } from 'lucide-react';

interface HeaderProps {
  TopLeftSection?: ReactNode;
  TopRightSection?: ReactNode;
  BottomSection?: ReactNode;
}

export const Header = ({ TopLeftSection, TopRightSection, BottomSection }: HeaderProps) => {
  const theme = useTheme();
  const [headerHeight] = useUnit([$headerHeight]);
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeaderHeight(ref.current.offsetHeight);
    }
  });

  const handleThemeChange = useCallback(() => {
    if (theme.theme === 'dark') {
      theme.setTheme('light');
    } else {
      theme.setTheme('dark');
    }
  }, [theme]);

  return (
    <>
      <div
        ref={ref}
        className={cn('fixed top-0 z-1', 'bg-background/30 backdrop-blur-3xl border-b w-full pt-4')}
      >
        <div className={'wrapper flex flex-col gap-4 items-start'}>
          <div className={'w-full flex flex-row items-center gap-10'}>
            <div className={'flex-1 flex flex-row gap-10 items-center'}>
              <Link to={'/'}>
                <div className={'flex flex-row gap-4 items-center'}>
                  <img
                    src={'/favicon.png'}
                    alt={''}
                    className={'w-[35px] h-[35px] object-cover rounded-full outline shadow-lg'}
                  />

                  <span>FlowViewer</span>
                </div>
              </Link>

              {TopLeftSection}
            </div>

            {TopRightSection}

            <Button
              onClick={handleThemeChange}
              variant={'ghost'}
              className={'aspect-square h-10 rounded-full'}
            >
              {theme.theme === 'dark' && <MoonIcon />}
              {theme.theme === 'light' && <SunIcon />}
            </Button>
          </div>

          <div className={'flex flex-row gap-10'}>{BottomSection}</div>
        </div>
      </div>

      <div style={{ height: `${headerHeight}px` }} />
    </>
  );
};
