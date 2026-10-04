import { cn } from '@/shared/lib/utils.ts';
import { FooterBlock } from '@/widgets/footer/ui/footer-block.tsx';
import { GitHubIcon, NextFlowIcon, TelegramIcon, XTwitterIcon } from '@/shared/assets/icons';
import { BookOpenIcon, MailIcon, MonitorCogIcon } from 'lucide-react';

export const Footer = () => {
  return (
    <div className={cn('mt-auto border-t py-5', 'text-[10pt] font-light bg-background-total')}>
      <div className={'wrapper flex flex-row gap-10'}>
        <div className={'max-w-[300px] flex flex-col gap-1'}>
          <span className={'text-[14pt]'}>Flow Viewer</span>
          <span className={'text-[10pt] text-foreground/50 font-light'}>
            A platform for real-time visualization, monitoring, and analysis of nextflow pipeline
            execution.
          </span>
          <a
            href={'https://t.me/rosetomorrow'}
            target={'_blank'}
            className={'text-[8pt] mt-3 animate-pulse'}
          >
            Developing by Alexey Kucherenko
          </a>
        </div>

        <div className={'flex-1'} />

        {/*<FooterBlock*/}
        {/*  title={'Store'}*/}
        {/*  items={[*/}
        {/*    {*/}
        {/*      title: 'NextFlow plugin',*/}
        {/*      src: 'https://registry.nextflow.io/plugins',*/}
        {/*      icon: <NextFlowIcon />,*/}
        {/*      newTab: true,*/}
        {/*    },*/}
        {/*    {*/}
        {/*      title: 'WebView',*/}
        {/*      src: 'https://hub.docker.com/r/nextflow/nextflow',*/}
        {/*      icon: <DockerIcon />,*/}
        {/*      newTab: true,*/}
        {/*    },*/}
        {/*  ]}*/}
        {/*/>*/}

        <FooterBlock
          title={'Development'}
          items={[
            {
              title: 'NextFlow plugin',
              src: '#',
              icon: <GitHubIcon />,
              newTab: true,
            },
            {
              title: 'WebView',
              src: '#',
              icon: <GitHubIcon />,
              newTab: true,
            },
          ]}
        />

        <FooterBlock
          title={'Docs'}
          items={[
            {
              title: 'WebView',
              src: '/docs/web-view',
              icon: <MonitorCogIcon size={16} />,
            },
            {
              title: 'NextFlow plugin',
              src: '/docs/nf-plugin',
              icon: <NextFlowIcon />,
            },
            {
              title: 'API',
              src: '/docs/api',
              icon: <BookOpenIcon size={16} />,
            },
          ]}
        />

        <FooterBlock
          title={'Contact me'}
          items={[
            {
              title: 'antidot237@gmail.com',
              src: 'mailto://antidot237@gmail.com',
              icon: <MailIcon size={16} />,
              newTab: true,
            },
            {
              title: 'Telegram',
              src: 'https://t.me/rosetomorrow',
              icon: <TelegramIcon />,
              newTab: true,
            },
            {
              title: 'voyadgerodin',
              src: 'https://x.com/voyadgerodin',
              icon: <XTwitterIcon />,
              newTab: true,
            },
          ]}
        />
      </div>
    </div>
  );
};
