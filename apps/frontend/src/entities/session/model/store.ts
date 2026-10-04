import { createEffect, createEvent, createStore } from 'effector';
import type { TProcessStatus, TSession } from '@flowviewer/shared';
import type {
  TSessionsFiltersResponseDTO,
  TSessionsRequestDTO,
  TSessionsResponseDTO,
} from '../model/types.ts';
import { API_HOST } from '@/shared/lib/getEnvs.ts';

const BASE_URL = `${API_HOST}/api`;

export const fetchSessions = createEffect((params: TSessionsRequestDTO) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return fetch(`${BASE_URL}/sessions${query && `?${query}`}`).then(
    value => value.json() as Promise<TSessionsResponseDTO>
  );
});

export const fetchSessionsFilters = createEffect(() => {
  return fetch(`${BASE_URL}/sessions/filters`).then(
    value => value.json() as Promise<TSessionsFiltersResponseDTO>
  );
});

export const fetchSession = createEffect((sessionId: number) => {
  return fetch(`${BASE_URL}/sessions/${sessionId}`).then(value =>
    value.type !== 'error' ? (value.json() as Promise<TSession>) : null
  );
});

// ------------------------------------------------------------

export const addSession = createEvent<TSession>();
export const setSessionStatus = createEvent<{
  sessionId: number;
  status: TProcessStatus;
  completedTime?: number;
}>();
export const $sessions = createStore<TSessionsResponseDTO | null>(null)
  .on(fetchSessions.doneData, (_, payload) => payload)
  .on(addSession, (state, payload) => {
    if (state?.page !== 1) {
      return state;
    }
    return {
      ...state,
      items: [payload, ...state.items],
    } as TSessionsResponseDTO;
  })
  .on(setSessionStatus, (state, payload) => {
    return {
      ...state,
      items: state?.items.map(session => {
        if (session.id === payload.sessionId) {
          return {
            ...session,
            status: payload.status,
            completedTime: payload.completedTime,
          };
        }
        return session;
      }),
    } as TSessionsResponseDTO;
  });

export const $sessionsFilters = createStore<TSessionsFiltersResponseDTO | null>(null).on(
  fetchSessionsFilters.doneData,
  (_, payload) => payload
);

export const $session = createStore<TSession | null>(null)
  .on(fetchSession.doneData, (_, payload) => payload)
  .on(setSessionStatus, (state, payload) => {
    if (payload.sessionId !== state?.id) {
      return state;
    }

    return {
      ...state,
      status: payload.status,
      completedTime: payload.completedTime,
    };
  });
