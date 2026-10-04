import { createEffect, createEvent, createStore } from 'effector';
import type { TAnalytic, TProcessTelemetry } from '@flowviewer/shared';
import { API_HOST } from '@/shared/lib/getEnvs.ts';

const BASE_URL = `${API_HOST}/api`;

export const fetchWorkflowProcesses = createEffect((workflow: string) => {
  return fetch(`${BASE_URL}/telemetry/workflow/${workflow}/processes`).then(
    value => value.json() as Promise<string[]>
  );
});

export const fetchWorkflowProcessTelemetry = createEffect(
  async ({ workflow, processName }: { workflow: string; processName: string }) => {
    const value = await fetch(
      `${BASE_URL}/telemetry/workflow/${workflow}/processes/${processName}`
    );
    return await (value.json() as Promise<TAnalytic[]>);
  }
);

export const fetchSessionTelemetry = createEffect((sessionId: number) => {
  return fetch(`${BASE_URL}/telemetry/session/${sessionId}`).then(value =>
    value.status === 200 ? (value.json() as Promise<TProcessTelemetry[]>) : null
  );
});

export const fetchProcessTelemetry = createEffect((processId: number) => {
  return fetch(`${BASE_URL}/telemetry/process/${processId}`).then(value =>
    value.status === 200 ? (value.json() as Promise<TProcessTelemetry>) : null
  );
});

// ------------------------------------------------------------

export const $workflowProcesses = createStore<string[]>([]).on(
  fetchWorkflowProcesses.doneData,
  (_, payload) => payload
);

export const $workflowProcessTelemetry = createStore<TAnalytic[]>([]).on(
  fetchWorkflowProcessTelemetry.doneData,
  (_, payload) => payload.reverse()
);

export const setSessionTelemetry = createEvent<TProcessTelemetry[]>();
export const $sessionTelemetry = createStore<TProcessTelemetry[] | null>([])
  .on(setSessionTelemetry, (_, payload) => payload)
  .on(fetchSessionTelemetry.doneData, (_, payload) => payload);

export const setProcessTelemetry = createEvent<TProcessTelemetry | null>();
export const $processTelemetry = createStore<TProcessTelemetry | null>(null)
  .on(setProcessTelemetry, (_, payload) => payload)
  .on(fetchProcessTelemetry.doneData, (_, payload) => payload);
