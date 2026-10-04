import { TWebSocketRoomClass } from '@flowviewer/shared/types/api/web-sockets';

export const formatWebsocketRoomType = (
  type: TWebSocketRoomClass,
  data?: Record<string, any>,
): string => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
  return type.replace(/<(\w+)>/g, (match, key: string) => {
    if (!data) {
      return match;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return key in data ? String(data[key]) : match;
  });
};
