import { createEffect, createEvent, createStore } from 'effector';
import type { TEdges, TProcess, TProcessStatus } from '@flowviewer/shared';
import { API_HOST } from '@/shared/lib/getEnvs.ts';

const BASE_URL = `${API_HOST}/api`;

export const fetchEdges = createEffect((sessionId: number) => {
  return fetch(`${BASE_URL}/processes/${sessionId}/edges`).then(
    value => value.json() as Promise<TEdges>
  );
});

export const fetchProcesses = createEffect((sessionId: number) => {
  return fetch(`${BASE_URL}/processes/${sessionId}/processes`).then(
    value => value.json() as Promise<TProcess[]>
  );
});

// ------------------------------------------------------------

export const setProcesses = createEvent<TProcess[]>();
export const setProcessStatus = createEvent<{
  processId: number;
  status: TProcessStatus;
  time: number;
}>();
export const $processes = createStore<TProcess[] | null>(null)
  .on(setProcesses, (_, payload) => payload)
  .on(setProcessStatus, (state, payload) => {
    return state?.map((process: TProcess) => {
      if (process.processId === payload.processId) {
        const result: TProcess = {
          ...process,
          status: payload.status,
        };
        if (payload.status === 'RUNNING') {
          result.startTime = payload.time;
        } else if (
          payload.status === 'SUCCEEDED' ||
          payload.status === 'CACHED' ||
          payload.status === 'FAILED'
        ) {
          result.completeTime = payload.time;
        }

        return result;
      }
      return process;
    });
  })
  .on(fetchProcesses.doneData, (_, payload) => payload);

export const setEdges = createEvent<TEdges>();
export const $edges = createStore<TEdges | null>(null)
  .on(setEdges, (_, payload) => payload)
  .on(fetchEdges.doneData, (_, payload) => payload);

export const setProcessSelectedId = createEvent<number | null>();
export const $processSelectedId = createStore<number | null>(null).on(
  setProcessSelectedId,
  (_, payload) => payload
);
