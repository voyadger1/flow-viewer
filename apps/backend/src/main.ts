import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketServerService } from './websocket/websocket.server';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  });

  if (isProduction) {
    const publicPath = join(__dirname, '..', '..', 'public');

    app.use((req, res, next) => {
      if (
        req.method === 'GET' &&
        !req.path.startsWith('/api') &&
        !req.path.includes('.')
      ) {
        res.sendFile(join(publicPath, 'index.html'));
      } else {
        next();
      }
    });

    app.use(express.static(publicPath, { fallthrough: true }));
  } else {
    app.use(
      '/',
      createProxyMiddleware({
        pathFilter: (pathname) => !pathname.startsWith('/api'),
        target: 'http://localhost:5173',
        changeOrigin: true,
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const server = await app.listen(PORT);

  const wsService = app.get(WebSocketServerService);
  wsService.attachToServer(server);
}
bootstrap();
