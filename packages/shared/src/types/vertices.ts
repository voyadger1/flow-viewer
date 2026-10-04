import type { TProcessStatus } from './status';

export type TVerticesType = 'PROCESS' | 'OPERATOR' | 'ORIGIN' | 'NODE';

export type TProcess = {
  id: number;
  vertexId: number;
  sessionId: number;
  processId: number;
  label?: string;
  type: TVerticesType;
  status: TProcessStatus;
  startTime: number;
  completeTime: number;
};

export type TProcessTelemetry = {
  processId?: number;
  hash?: string;
  realtime?: number;
  startTime?: number;
  completeTime?: number;
  cpuPercent?: number;
  cpus?: number;
  cpu_model?: string;
  mem?: number;
  rss?: number;
  vmem?: number;
  peakRss?: number;
  peakVmem?: number;
  memory?: number;
  rchar?: number;
  wchar?: number;
  readBytes?: number;
  writeBytes?: number;
  container?: string;
  disk?: number;
  module?: string;
  exitStatus?: number;
  hostname?: string;
  inv_ctxt?: number;
  vol_ctxt?: number;
  error_action?: string;
  queue?: string;
  scratch?: string;
};
export type TTelemetryKey = keyof TProcessTelemetry;

export type TEdge = {
  id: number;
  label: string | null;
  fromId?: number | null;
  toId?: number | null;
};

export type TEdges = {
  sessionId: number;
  edges: TEdge[];
};
