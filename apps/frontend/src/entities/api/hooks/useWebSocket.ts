import { useEffect, useRef, useState } from 'react';
import type { TWebSocketPackage, TWebSocketRoomClass } from '@flowviewer/shared';

export interface UseWebSocketProps {
  url: string;
  onConnected?: () => void;
  onMessage?: (message: TWebSocketPackage | null) => void;
  onClose?: () => void;
  room: {
    type: TWebSocketRoomClass;
    typeProps?: Record<string, any>;
  };
}

export const useWebSocket = ({ url, onConnected, onMessage, onClose, room }: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      onConnected?.();

      wsRef.current?.send(
        JSON.stringify({
          type: 'CONNECT',
          status: 'connected',
          roomType: room.type,
          roomTypeProps: room.typeProps,
        } as TWebSocketPackage)
      );
    };

    ws.onclose = () => {
      setIsConnected(false);
      onClose?.();
    };

    ws.onmessage = event => {
      const message: TWebSocketPackage = JSON.parse(event.data) as TWebSocketPackage;
      onMessage?.(message);
    };

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = (message: TWebSocketPackage) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, sendMessage };
};
