import type { TSession } from '@flowviewer/shared';
import type { TPaginationRequestDTO, TPaginationResponseDTO } from '@/entities/api/types.ts';

export type TSessionsFilter = {
  workFlow?: string | null;
  runBy?: string | null;
};

export type TSessionsFiltersResponseDTO = {
  runsBy: string[];
  workFlows: string[];
};

export type TSessionsRequestDTO = TSessionsFilter & TPaginationRequestDTO;

export type TSessionsResponseDTO = {
  items: TSession[];
} & TPaginationResponseDTO;
