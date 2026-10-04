import { PROCESS_STATUSES } from '@/widgets/statuses/process-statuses.tsx';
import { useUnit } from 'effector-react/effector-react.umd';
import { $session, $sessions, fetchSessions } from '@/entities/session';
import type { TSession } from '@flowviewer/shared';
import { useEffect, useMemo, useState } from 'react';
import { formatDuration } from '@/shared/lib/datetime.ts';
import { cn, getPositiveNumber } from '@/shared/lib/utils.ts';
import { Link } from 'react-router-dom';
import { PaginationSelector } from '@/widgets/pagination-selector/pagination-selector.tsx';
import type { TSessionsRequestDTO, TSessionsResponseDTO } from '@/entities/session/model/types.ts';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer.tsx';

const SessionItem = ({ session }: { session: TSession }) => {
  const [sessionStore] = useUnit([$session]);
  const [timeNow, setTimeNow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(Date.now());
    }, 1000);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeNow(Date.now());

    return () => clearInterval(interval);
  }, []);

  const timing = useMemo(() => {
    if (!session.startTime) {
      return '';
    }

    const completeTime = session.completedTime ? session.completedTime : timeNow;

    return formatDuration(getPositiveNumber(Math.round(completeTime - session.startTime)));
  }, [session, timeNow]);

  return (
    <Link
      to={`/sessions/${session.id}/flow`}
      className={cn(
        'bg-foreground/5 p-2 rounded-md flex flex-row gap-1 items-center',
        'cursor-pointer hover:outline',
        sessionStore?.id === session.id && 'border bg-foreground/15'
      )}
    >
      <div className={'flex flex-row items-center gap-2'}>
        {session.status && PROCESS_STATUSES[session.status]}
        <span className={'font-mono'}>{session.runName}</span>
      </div>

      <div className={'flex-1'} />

      <span className={'ml-4 text-[8pt] text-foreground/50'}>{timing}</span>
    </Link>
  );
};

interface SessionsListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SessionsList = ({ open, onOpenChange }: SessionsListProps) => {
  const [sessionResponse, setSessionResponse] = useState<TSessionsResponseDTO | null>(null);
  const [session, sessions] = useUnit([$session, $sessions]);

  const [sessionRequest, setSessionRequest] = useState<TSessionsRequestDTO>({
    limit: 15,
    workFlow: session?.workflowName,
  });

  const handleSessionPageSelected = (page: number) => {
    setSessionRequest(prevState => ({
      ...prevState,
      page: page,
    }));
  };

  const handleFetchSessions = async (params: TSessionsRequestDTO) => {
    setSessionResponse(await fetchSessions(params));
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionRequest(prevState => ({
      ...prevState,
      page: 1,
    }));
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    (async () => {
      await handleFetchSessions(sessionRequest);
    })();
  }, [sessionRequest, open]);

  useEffect(() => {
    if (!session?.workflowName) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionRequest(prevState => ({
      ...prevState,
      workFlow: session?.workflowName,
    }));
  }, [session]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={'right'}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{session?.workflowName}</DrawerTitle>
          <DrawerDescription>All runners this workflow</DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 scroll-fade overflow-y-auto p-4 flex flex-col gap-4">
          <div className={'flex flex-col gap-1 flex-1'}>
            {sessions?.items?.map(session => (
              <SessionItem key={session.id} session={session} />
            ))}
          </div>
        </div>

        {sessionResponse && sessionResponse.totalPages && sessionResponse.totalPages > 1 && (
          <DrawerFooter>
            <PaginationSelector
              pagination={sessionResponse}
              onPageSelected={handleSessionPageSelected}
              onlyIcons
            />
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
