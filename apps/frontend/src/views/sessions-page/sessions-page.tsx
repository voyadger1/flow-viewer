import { XIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button.tsx';
import { cn } from '@/shared/lib/utils.ts';
import { PipelinesTable } from '@/views/sessions-page/ui/pipelines-table.tsx';
import { useEffect, useMemo, useState } from 'react';
import {
  $sessionsFilters,
  addSession,
  fetchSessions,
  fetchSessionsFilters,
  setSessionStatus,
} from '@/entities/session';
import { useWebSocket } from '@/entities/api/hooks/useWebSocket.ts';
import type { TWebSocketPackage } from '@flowviewer/shared';
import { Header } from '@/widgets/header/header.tsx';
import type { TSessionsRequestDTO, TSessionsResponseDTO } from '@/entities/session/model/types.ts';
import { PaginationSelector } from '@/widgets/pagination-selector/pagination-selector.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select.tsx';
import { useUnit } from 'effector-react';
import { WS_HOST } from '@/shared/lib/getEnvs.ts';

export const SessionsPage = () => {
  const [sessionsFilters] = useUnit([$sessionsFilters]);

  const [sessionRequest, setSessionRequest] = useState<TSessionsRequestDTO>({
    limit: 15,
  });
  const [sessionResponse, setSessionResponse] = useState<TSessionsResponseDTO | null>(null);

  const onMessage = (message: TWebSocketPackage | null) => {
    if (message?.type === 'SESSION_CREATED') {
      addSession(message.session);
    }

    if (message?.type === 'SESSION_STATUS') {
      setSessionStatus({
        sessionId: message.sessionId,
        status: message.status,
        completedTime: message.completedTime,
      });
    }
  };

  useWebSocket({
    url: `${WS_HOST}/pipeline`,
    onMessage: onMessage,
    room: {
      type: 'SESSIONS_LIST',
    },
  });

  const handleFetchSessions = async (params: TSessionsRequestDTO) => {
    setSessionResponse(await fetchSessions(params));
  };

  const handleSessionPageSelected = (page: number) => {
    setSessionRequest(prevState => ({
      ...prevState,
      page: page,
    }));
  };

  useEffect(() => {
    (async () => {
      await handleFetchSessions(sessionRequest);
    })();
  }, [sessionRequest]);

  useEffect(() => {
    fetchSessionsFilters();
  }, []);

  const workflowsItems = useMemo(() => {
    return [
      { label: 'Select a workflow', value: '-' },
      ...(sessionsFilters
        ? sessionsFilters.workFlows.map(workflow => ({ label: workflow, value: workflow }))
        : []),
    ];
  }, [sessionsFilters]);

  const runByItems = useMemo(() => {
    return [
      { label: 'Select a run by', value: '-' },
      ...(sessionsFilters
        ? sessionsFilters.runsBy.map(runBy => ({ label: runBy, value: runBy }))
        : []),
    ];
  }, [sessionsFilters]);

  const clearFilters = () => {
    setSessionRequest(prevState => ({ limit: prevState.limit }));
  };

  const handleSetFilter = (filter: keyof TSessionsRequestDTO, value?: string | null) => {
    setSessionRequest(prevState => ({
      ...prevState,
      page: 1,
      [filter]: value ?? '',
    }));
  };

  return (
    <div className={'w-full flex flex-col gap-4'}>
      <Header
        TopLeftSection={
          <div className={'flex-1 flex flex-row gap-4'}>
            <Select
              items={workflowsItems}
              value={sessionRequest.workFlow || '-'}
              onValueChange={e => {
                handleSetFilter('workFlow', e === '-' ? null : (e?.toString() ?? ''));
              }}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align={'start'}>
                {workflowsItems?.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              items={runByItems}
              value={sessionRequest.runBy || '-'}
              onValueChange={e => {
                handleSetFilter('runBy', e === '-' ? null : (e?.toString() ?? ''));
              }}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align={'start'}>
                {runByItems.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant={'ghost'} onClick={clearFilters}>
              <XIcon />
              Clear filters
            </Button>
          </div>
        }
      />

      {/* Pipelines */}
      <div className={cn('wrapper', 'w-full h-full flex flex-col gap-4')}>
        <PipelinesTable setFilter={handleSetFilter} />

        {!!sessionResponse && !!sessionResponse.totalPages && sessionResponse.totalPages > 1 && (
          <PaginationSelector
            pagination={sessionResponse}
            onPageSelected={handleSessionPageSelected}
          />
        )}
      </div>
    </div>
  );
};
