import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WebSocket, WebSocketServer } from 'ws';
import { Server } from 'http';
import {
  TWebSocketPackage,
  TWebSocketRoomClass,
} from '@flowviewer/shared/types/api/web-sockets';
import { formatWebsocketRoomType } from './lib/utils';
import { ROOMS_TYPING } from './lib/rooms-config';

@Injectable()
export class WebSocketServerService implements OnModuleInit {
  private wss: WebSocketServer;
  private readonly logger = new Logger(WebSocketServerService.name);
  private rooms = new Map<string, Set<WebSocket>>();

  constructor() {}

  onModuleInit() {
    try {
      this.wss = new WebSocketServer({
        noServer: true,
      });
    } catch (error) {
      this.logger.error(`❌ WebSocket error: ${error}`);
    }
  }

  attachToServer(server: Server) {
    if (!server) {
      this.logger.error('❌ Server not found');
      return;
    }

    server.on('upgrade', (request, socket, head) => {
      if (request.url === '/pipeline') {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.handleConnection(ws);
        });
      }
    });
  }

  private handleConnection(ws: WebSocket) {
    ws.on('message', (data: Buffer) => {
      const message: TWebSocketPackage = JSON.parse(
        data.toString(),
      ) as TWebSocketPackage;

      if (message.type === 'CONNECT') {
        const roomId = formatWebsocketRoomType(
          message.roomType,
          message.roomTypeProps,
        );
        this.joinToRoom(roomId, ws);
      }

      this.broadcast(message);
    });

    ws.on('close', () => {
      this.leaveRoom(ws);
    });

    ws.on('error', (error) => {
      this.logger.error(`❌ WebSocket error: ${error.message}`);
    });
  }

  broadcast(message: TWebSocketPackage) {
    Object.keys(ROOMS_TYPING).forEach((key: TWebSocketRoomClass) => {
      if (!ROOMS_TYPING[key].includes(message.type)) {
        return;
      }

      const roomId = formatWebsocketRoomType(key, message);

      this.rooms.get(roomId)?.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    });
  }

  joinToRoom(roomId: string, client: WebSocket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(client);
  }

  private leaveRoom(client: WebSocket) {
    this.rooms.forEach((room, roomId) => {
      room.delete(client);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    });
  }
}
