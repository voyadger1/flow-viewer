import {
  TWebSocketPackageType,
  TWebSocketRoomClass,
} from '@flowviewer/shared/types/api/web-sockets';

export const ROOMS_TYPING: Record<
  TWebSocketRoomClass,
  TWebSocketPackageType[]
> = {
  SESSIONS_LIST: ['SESSION_CREATED', 'SESSION_STATUS'],
  'SESSION_<sessionId>': [
    'SESSION_CREATED',
    'SESSION_STATUS',
    'PROCESSES',
    'PROCESS_STATUS',
  ],
};
