import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import {
  TEdges,
  TProcess,
  TProcessStatus,
  TSessionData,
  TProcessTelemetry,
} from '@flowviewer/shared';
import { PaginationDto } from '../dto/pagination.dto';
import { SessionsFilterDto } from '../dto/sessionsFilter.dto';
import { TArtifact } from '@flowviewer/shared/types/artifact';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  /* ------------------ SESSIONS ------------------ */

  @Get('sessions')
  getSessions(@Query() query: PaginationDto & SessionsFilterDto) {
    return this.apiService.getSessions(
      query.page,
      query.limit,
      query.workFlow,
      query.runBy,
    );
  }

  @Get('sessions/filters')
  getSessionsFilters() {
    return this.apiService.getSessionsFilters();
  }

  @Get('sessions/:id')
  getSession(@Param('id', ParseIntPipe) id: number) {
    return this.apiService.getSession(id);
  }

  @Post('session')
  createSession(@Body() body: { sessionData: TSessionData }) {
    return this.apiService.createSession(body.sessionData);
  }

  @Put('sessions/:sessionId/status')
  updateSessionStatus(
    @Body() body: { status: TProcessStatus },
    @Param('sessionId', ParseIntPipe) sessionId: number,
  ) {
    this.apiService.updateSessionStatus({
      sessionId: sessionId,
      status: body.status,
    });

    return { status: 'ok' };
  }

  /* ------------------ PROCESS ------------------ */

  @Post('processes')
  setProcessesGraph(
    @Body() body: { sessionId: number; processes: TProcess[]; edges: TEdges },
  ) {
    return this.apiService.setProcessesGraph(
      body.sessionId,
      body.processes,
      body.edges,
    );
  }

  @Get('processes/:sessionId/edges')
  getEdges(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.apiService.getEdges(sessionId);
  }

  @Get('processes/:sessionId/processes')
  getProcesses(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.apiService.getProcesses(sessionId);
  }

  @Put('process')
  updateProcess(
    @Body()
    body: {
      sessionId: number;
      processId: number;
      status: TProcessStatus;
      time: number;
      telemetry?: TProcessTelemetry;
    },
  ) {
    this.apiService.updateProcess(body);
    return { status: 'ok' };
  }

  /* ------------------ TELEMETRY ------------------ */

  @Get('telemetry/session/:sessionId')
  getTelemetrySession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.apiService.getTelemetrySession(sessionId);
  }

  @Get('telemetry/process/:processId')
  getTelemetryProcess(@Param('processId', ParseIntPipe) processId: number) {
    return this.apiService.getTelemetryProcess(processId);
  }

  @Get('telemetry/workflow/:workflow/processes')
  getTelemetryWorkflowProcesses(@Param('workflow') workflow: string) {
    return this.apiService.getTelemetryWorkflowProcesses(workflow);
  }

  @Get('telemetry/workflow/:workflow/processes/:processName')
  getTelemetryWorkflowProcess(
    @Param('workflow') workflow: string,
    @Param('processName') processName: string,
  ) {
    return this.apiService.getTelemetryWorkflowProcess(workflow, processName);
  }

  /* ------------------ ARTIFACTS ------------------ */
  @Post('artifacts')
  createArtifact(@Body() body: { artifact: TArtifact }) {
    return this.apiService.createArtifact(body.artifact);
  }

  @Get('artifacts/:sessionId')
  getArtifacts(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.apiService.getArtifacts(sessionId);
  }
}
