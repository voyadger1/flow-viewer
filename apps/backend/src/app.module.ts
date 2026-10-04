import { Module } from '@nestjs/common';
import { WebSocketServerService } from './websocket/websocket.server';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  providers: [WebSocketServerService],
  imports: [
    ApiModule,
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: join(process.cwd(), '..', '..', 'data', 'database.sqlite'),
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
    }),
  ],
})
export class AppModule {}
