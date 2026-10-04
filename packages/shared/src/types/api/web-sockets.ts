import type { TProcessStatus } from '../status';
import type { TEdges, TProcess } from '../vertices';
import type { TSession } from '../session';

export type TWebSocketRoomClass = 'SESSIONS_LIST' | 'SESSION_<sessionId>';

export type TWebSocketPackage =
  TWSConnect | TWSSessionCreated | TWSSessionStatus | TWSProcesses | TWSProcessStatus;

export type TWebSocketPackageType = TWebSocketPackage['type'];

export type TWSConnect = {
  type: 'CONNECT';
  status: 'connected' | 'disconnected';
  roomType: TWebSocketRoomClass;
  roomTypeProps?: Record<string, any>;
};

export type TWSSessionCreated = {
  type: 'SESSION_CREATED';
  sessionId: number;
  session: TSession;
};

export type TWSSessionStatus = {
  type: 'SESSION_STATUS';
  sessionId: number;
  status: TProcessStatus;
  completedTime?: number;
};

export type TWSProcesses = {
  type: 'PROCESSES';
  sessionId: number;
  processes: TProcess[];
  edges: TEdges;
};

export type TWSProcessStatus = {
  type: 'PROCESS_STATUS';
  sessionId: number;
  processId: number;
  status: TProcessStatus;
  time: number;
};
