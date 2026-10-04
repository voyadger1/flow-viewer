import type { ReactNode } from 'react';
import {
  StatusCreated,
  StatusRunning,
  StatusSucceeded,
  StatusCached,
  StatusFailed,
} from '@/widgets/statuses/index.ts';
import type { TProcessStatus } from '@flowviewer/shared';
import { StatusCancelled } from '@/widgets/statuses/status-cancelled.tsx';

export const PROCESS_STATUSES: Record<TProcessStatus, ReactNode> = {
  CREATED: <StatusCreated />,
  RUNNING: <StatusRunning />,
  SUCCEEDED: <StatusSucceeded />,
  CACHED: <StatusCached />,
  FAILED: <StatusFailed />,
  CANCELLED: <StatusCancelled />,
};
