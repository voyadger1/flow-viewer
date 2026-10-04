import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { WebSocketServerService } from '../websocket/websocket.server';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Edges } from './entities/edges.entity';
import { Process } from './entities/process.entity';
import { ProcessTelemetry } from './entities/process-telemetry.entity';
import { Artifacts } from './entities/artifact.entity';

@Module({
  controllers: [ApiController],
  providers: [ApiService, WebSocketServerService],
  imports: [
    TypeOrmModule.forFeature([
      Session,
      Process,
      Edges,
      ProcessTelemetry,
      Artifacts,
    ]),
  ],
})
export class ApiModule {}
