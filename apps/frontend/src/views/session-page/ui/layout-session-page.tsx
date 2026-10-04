import { Header } from '@/widgets/header/header.tsx';
import { Badge } from '@/shared/ui/badge.tsx';
import {
  BookOpenTextIcon,
  ChartSplineIcon,
  FileCheckIcon,
  FileTextIcon,
  NetworkIcon,
  SquareStackIcon,
} from 'lucide-react';
import { Button, buttonVariants } from '@/shared/ui/button.tsx';
import { useUnit } from 'effector-react/effector-react.umd';
import { $session, fetchSession, setSessionStatus } from '@/entities/session';
import { setEdges, setProcesses, setProcessStatus } from '@/entities/processes';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { cn } from '@/shared/lib/utils.ts';
import { useWebSocket } from '@/entities/api/hooks/useWebSocket.ts';
import type { TWebSocketPackage } from '@flowviewer/shared';
import { Spinner } from '@/shared/ui/spinner.tsx';
import { SessionsList } from './sessions-list.tsx';
import { SessionNotFoundPage } from './session-not-found.tsx';
import { toast } from '@/shared/ui/toast.tsx';
import { WS_HOST } from '@/shared/lib/getEnvs.ts';

type SessionParams = {
  sessionId: string;
};

interface LayoutSessionPageProps {
  children: ReactNode;
}

export const LayoutSessionPage = ({ children }: LayoutSessionPageProps) => {
  const { sessionId } = useParams<SessionParams>();
  const [session, loadingSession] = useUnit([$session, fetchSession.pending]);
  const [openAllRunners, setOpenAllRunners] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchSession(Number(sessionId));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenAllRunners(false);
  }, [sessionId]);

  const sessionStatusBadge = useMemo(() => {
    if (session?.status === 'SUCCEEDED') {
      return 'success';
    } else if (session?.status === 'FAILED') {
      return 'destructive';
    }
    return 'default';
  }, [session]);

  const pageName = useMemo(() => location.pathname.split('/').reverse()[0], [location.pathname]);

  const onMessage = (message: TWebSocketPackage | null) => {
    if (message?.type === 'SESSION_STATUS') {
      toast.add({
        title: 'Session completed',
        description: `status: ${message?.status}`,
      });

      setSessionStatus({
        sessionId: message.sessionId,
        status: message.status,
        completedTime: message.completedTime,
      });
    }

    if (message?.type === 'PROCESSES') {
      setProcesses(message.processes);
      setEdges(message.edges);
    }

    if (message?.type === 'PROCESS_STATUS') {
      setProcessStatus({
        processId: message.processId,
        status: message.status,
        time: message.time,
      });
    }
  };

  useWebSocket({
    url: `${WS_HOST}/pipeline`,
    onMessage: onMessage,
    room: {
      type: 'SESSION_<sessionId>',
      typeProps: {
        sessionId: sessionId,
      },
    },
  });

  return (
    <>
      <div className={'w-full flex flex-col gap-0 items-center'}>
        <Header
          TopLeftSection={
            !!session && (
              <Badge variant={sessionStatusBadge}>
                {session?.status === 'RUNNING' && <Spinner />}
                {session?.runName}
              </Badge>
            )
          }
          BottomSection={
            !!session && (
              <div className={'flex flex-row gap-1 mb-1'}>
                {(
                  [
                    {
                      children: (
                        <>
                          <BookOpenTextIcon /> Info
                        </>
                      ),
                      src: `/sessions/${sessionId}/info`,
                      pageName: 'info',
                    },
                    {
                      children: (
                        <>
                          <NetworkIcon /> Flow
                        </>
                      ),
                      src: `/sessions/${sessionId}/flow`,
                      pageName: 'flow',
                    },
                    {
                      children: (
                        <>
                          <ChartSplineIcon /> Analytics
                        </>
                      ),
                      src: `/sessions/${sessionId}/analytics`,
                      pageName: 'analytics',
                    },
                    {
                      children: (
                        <>
                          <FileCheckIcon /> Artifacts
                        </>
                      ),
                      src: `/sessions/${sessionId}/artifacts`,
                      pageName: 'artifacts',
                    },
                    {
                      children: (
                        <>
                          <FileTextIcon /> Properties
                        </>
                      ),
                      src: `/sessions/${sessionId}/properties`,
                      pageName: 'properties',
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

                {session?.workflowName && (
                  <Button variant={'ghost'} onClick={() => setOpenAllRunners(true)}>
                    <SquareStackIcon /> All runners
                  </Button>
                )}
              </div>
            )
          }
        />

        {loadingSession && !session ? (
          <div className={'w-full h-[40vh] flex items-center justify-center'}>
            <Spinner />
          </div>
        ) : !session ? (
          <SessionNotFoundPage />
        ) : (
          <div className={'wrapper !mt-4'}>{children}</div>
        )}
      </div>

      <SessionsList open={openAllRunners} onOpenChange={setOpenAllRunners} />
    </>
  );
};
