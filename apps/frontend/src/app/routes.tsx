import type { ReactNode } from 'react';
import { SessionsPage } from '@/views/sessions-page/sessions-page.tsx';
import { FlowsPage } from '@/views/session-page/flows/flows-page.tsx';
import { InfoPage } from '@/views/session-page/info/info-page.tsx';
import { AnalyticsPage } from '@/views/session-page/analytics/analytics-page.tsx';
import { ArtifactsPage } from '@/views/session-page/artifacts/artifacts-page.tsx';
import { PropertiesPage } from '@/views/session-page/properties/properties-page.tsx';
import { NotFoundPage } from '@/views/404/404-page.tsx';
import { DocsApiPage } from '@/views/docs/ui';
import { DocsNfPluginPage } from '@/views/docs/ui/sections/docs-nf-plugin-page.tsx';
import { DocsWebViewPage } from '@/views/docs/ui/sections/docs-web-view-page.tsx';
import { AboutPage } from '@/views/docs/ui/sections/docs-about-page.tsx';

export type TRoute = {
  path: string;
  node: ReactNode;
  title: string;
};

export const ROUTES: TRoute[] = [
  {
    path: '/',
    node: <SessionsPage />,
    title: 'All sessions',
  },
  {
    path: '/sessions/:sessionId/info',
    node: <InfoPage />,
    title: 'Session',
  },
  {
    path: '/sessions/:sessionId/flow',
    node: <FlowsPage />,
    title: 'Session',
  },
  {
    path: '/sessions/:sessionId/analytics',
    node: <AnalyticsPage />,
    title: 'Session',
  },
  {
    path: '/sessions/:sessionId/artifacts',
    node: <ArtifactsPage />,
    title: 'Session',
  },
  {
    path: '/sessions/:sessionId/properties',
    node: <PropertiesPage />,
    title: 'Session',
  },
  {
    path: '/docs/about',
    node: <AboutPage />,
    title: 'About',
  },
  {
    path: '/docs/api',
    node: <DocsApiPage />,
    title: 'API | Docs',
  },
  {
    path: '/docs/nf-plugin',
    node: <DocsNfPluginPage />,
    title: 'NextFlow Plugin | Docs',
  },
  {
    path: '/docs/web-view',
    node: <DocsWebViewPage />,
    title: 'Web View | Docs',
  },
  {
    path: '*',
    node: <NotFoundPage />,
    title: '404 error',
  },
];
