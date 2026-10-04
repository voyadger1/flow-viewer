import { createEffect, createEvent, createStore } from 'effector';
import type { TArtifact } from '@flowviewer/shared';
import { API_HOST } from '@/shared/lib/getEnvs.ts';

const BASE_URL = `${API_HOST}/api`;

export const fetchArtifacts = createEffect((sessionId: number) => {
  return fetch(`${BASE_URL}/artifacts/${sessionId}`).then(value =>
    value.status === 200 ? (value.json() as Promise<TArtifact[]>) : null
  );
});

// ------------------------------------------------------------

export const setArtifacts = createEvent<TArtifact[]>();
export const $artifacts = createStore<TArtifact[] | null>(null)
  .on(fetchArtifacts.doneData, (_, payload) => payload)
  .on(setArtifacts, (_, payload) => payload);
