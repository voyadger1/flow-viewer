import { Injectable, NotFoundException } from '@nestjs/common';
import { WebSocketServerService } from '../websocket/websocket.server';
import {
  type TAnalytic,
  TEdge,
  TEdges,
  TProcess,
  TProcessStatus,
  TProcessTelemetry,
  TSessionData,
} from '@flowviewer/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Edges } from './entities/edges.entity';
import { Process } from './entities/process.entity';
import { ProcessTelemetry } from './entities/process-telemetry.entity';
import { Artifacts } from './entities/artifact.entity';
import { TArtifact } from '@flowviewer/shared/types/artifact';

@Injectable()
export class ApiService {
  constructor(
    private readonly wsService: WebSocketServerService,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Process)
    private processRepository: Repository<Process>,
    @InjectRepository(Edges)
    private edgesRepository: Repository<Edges>,
    @InjectRepository(ProcessTelemetry)
    private processesTelemetryRepository: Repository<ProcessTelemetry>,
    @InjectRepository(Artifacts)
    private artifactsRepository: Repository<Artifacts>,
  ) {}

  /* ------------------ SESSIONS ------------------ */

  async getSessions(
    page = 1,
    limit = 5,
    workFlow: string = '',
    runBy: string = '',
  ) {
    const where: FindOptionsWhere<Session> = {};

    if (workFlow && workFlow.trim() !== '') {
      where.workflowName = workFlow;
    }

    if (runBy && runBy.trim() !== '') {
      where.runBy = runBy;
    }

    const [items, total] = await this.sessionRepository
      .createQueryBuilder('session')
      .select([
        'session.id',
        'session.status',
        'session.startTime',
        'session.completedTime',
        'session.workflowName',
        'session.scriptName',
        'session.runName',
        'session.runBy',
      ])
      .where(where)
      .orderBy('createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return {
      items,
      total: Number(total),
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };

    return this.sessionRepository.find({
      select: {
        id: true,
        status: true,
        startTime: true,
        completedTime: true,
        workflowName: true,
        scriptName: true,
        runName: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getSessionsFilters() {
    const listRunBy = (
      await this.sessionRepository
        .createQueryBuilder('session')
        .where("session.runBy IS NOT NULL AND session.runBy <> ''")
        .select('DISTINCT session.runBy', 'runBy')
        .getRawMany<{ runBy: string }>()
    ).map((value) => value.runBy);

    const listWorkFlow = (
      await this.sessionRepository
        .createQueryBuilder('session')
        .where(
          "session.workflowName IS NOT NULL AND session.workflowName <> ''",
        )
        .select('DISTINCT session.workflowName', 'workflowName')
        .getRawMany<{ workflowName: string }>()
    ).map((value) => value.workflowName);

    return {
      runsBy: listRunBy,
      workFlows: listWorkFlow,
    };
  }

  async getSession(sessionId: number): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }
    return session;
  }

  async createSession(sessionData: TSessionData) {
    const newSession = this.sessionRepository.create({
      ...sessionData,
      status: 'CREATED',
      startTime: Date.now(),
    });
    const session = await this.sessionRepository.save(newSession);

    this.wsService.broadcast({
      type: 'SESSION_CREATED',
      sessionId: session.id,
      session: {
        ...session,
        createdAt: session.createdAt.toString(),
        updatedAt: session.updatedAt.toString(),
      },
    });

    return session;
  }

  async updateSessionStatus({
    sessionId,
    status,
  }: {
    sessionId: number;
    status: TProcessStatus;
  }) {
    const completedTime = (
      ['SUCCEEDED', 'CACHED', 'FAILED'] as TProcessStatus[]
    ).includes(status)
      ? Date.now()
      : undefined;

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      return null;
    }
    Object.assign(session, { status: status, completedTime: completedTime });
    const sessionUpdated = await this.sessionRepository.save(session);

    this.wsService.broadcast({
      type: 'SESSION_STATUS',
      sessionId: sessionId,
      status: status,
      completedTime: completedTime,
    });

    const processesRunning = await this.processRepository.find({
      where: { sessionId: sessionId, status: 'RUNNING' },
    });

    processesRunning.map((process) =>
      this.updateProcess({
        sessionId: process.sessionId,
        processId: process.processId,
        status: 'CANCELLED',
        time: Date.now(),
      }),
    );

    return sessionUpdated;
  }

  /* ------------------ PROCESS ------------------ */

  async getEdges(sessionId: number): Promise<TEdges> {
    const edges = await this.edgesRepository.findOne({
      where: { sessionId: sessionId },
    });
    if (!edges) {
      throw new NotFoundException(
        `Edges with session id ${sessionId} not found`,
      );
    }
    return {
      sessionId: sessionId,
      edges: JSON.parse(edges.edgesJson) as TEdge[],
    };
  }

  async getProcesses(sessionId: number): Promise<Process[]> {
    const processes = await this.processRepository.find({
      where: { sessionId: sessionId },
    });
    if (!processes) {
      throw new NotFoundException(
        `Processes with session id ${sessionId} not found`,
      );
    }
    return processes;
  }

  async setProcessesGraph(
    sessionId: number,
    processes: TProcess[],
    edges: TEdges,
  ) {
    await this.processRepository.insert(
      processes.map((process) => ({
        vertexId: process.vertexId,
        sessionId: process.sessionId,
        processId: process.processId,
        label: process.label,
        type: process.type,
        status: process.status,
      })),
    );

    const newEdges = this.edgesRepository.create({
      sessionId: edges.sessionId,
      edgesJson: JSON.stringify(edges.edges),
    });
    await this.edgesRepository.save(newEdges);

    this.wsService.broadcast({
      type: 'PROCESSES',
      sessionId: sessionId,
      processes: processes,
      edges: edges,
    });
  }

  async updateProcess({
    sessionId,
    processId,
    status,
    time,
    telemetry,
  }: {
    sessionId: number;
    processId: number;
    status: TProcessStatus;
    time: number;
    telemetry?: TProcessTelemetry;
  }) {
    const process = await this.processRepository.findOne({
      where: { sessionId: sessionId, processId: processId },
    });

    if (!process) {
      return null;
    }

    Object.assign(process, { status: status });
    if (
      (
        ['SUCCEEDED', 'CACHED', 'FAILED', 'CANCELLED'] as TProcessStatus[]
      ).includes(status)
    ) {
      Object.assign(process, { completeTime: time });
    } else if (status === 'RUNNING') {
      Object.assign(process, { startTime: time });
    }

    const processesUpdated = await this.processRepository.save(process);

    if (telemetry) {
      const newTelemetry = this.processesTelemetryRepository.create({
        ...telemetry,
        sessionId: sessionId,
        processId: process.id,
      });
      await this.processesTelemetryRepository.save(newTelemetry);

      if (telemetry.hash) {
        const artifacts = await this.artifactsRepository.find({
          where: { sessionId: sessionId, hash: Like(`%${telemetry.hash}%`) },
        });

        await Promise.all(
          artifacts.map((artifact) => {
            Object.assign(artifact, { processId: process.id });
            return this.artifactsRepository.save(artifact);
          }),
        );
      }
    }

    this.wsService.broadcast({
      type: 'PROCESS_STATUS',
      sessionId: process.sessionId,
      processId: processId,
      status: status,
      time: time,
    });

    return processesUpdated;
  }

  /* ------------------ TELEMETRY ------------------ */

  async getTelemetrySession(
    sessionId: number,
  ): Promise<ProcessTelemetry[] | null> {
    const telemetry = await this.processesTelemetryRepository.find({
      where: { sessionId: sessionId },
    });

    if (!telemetry) {
      throw new NotFoundException(
        `Telemetry with session id ${sessionId} not found`,
      );
    }

    return telemetry;
  }

  async getTelemetryProcess(
    processId: number,
  ): Promise<ProcessTelemetry | null> {
    const telemetry = await this.processesTelemetryRepository.findOne({
      where: { processId: processId },
    });

    if (!telemetry) {
      throw new NotFoundException(
        `Telemetry with process id ${processId} not found`,
      );
    }

    return telemetry;
  }

  async getTelemetryWorkflowProcesses(workflow: string) {
    const result = await this.processRepository
      .createQueryBuilder('process')
      .innerJoin('process.session', 'session')
      .where('session.workflowName = :workflow', { workflow })
      .andWhere('process.type = :type', { type: 'PROCESS' })
      .select('DISTINCT process.label', 'label')
      .getRawMany<{ label: string }>();

    return result.map((result) => result.label);
  }

  async getTelemetryWorkflowProcess(workflow: string, processName: string) {
    const result = await this.processesTelemetryRepository
      .createQueryBuilder('process-telemetry')
      .innerJoin('process-telemetry.process', 'process')
      .innerJoin('process.session', 'session')
      .where('session.workflowName = :workflow', { workflow })
      .andWhere('process.type = :type', { type: 'PROCESS' })
      .andWhere('process.label = :processName', { processName })
      .select([
        'process-telemetry.realtime as realtime',
        'process-telemetry.cpuPercent as cpuPercent',
        'process-telemetry.mem as mem',
        'process-telemetry.rss as rss',
        'process-telemetry.vmem as vmem',
        'process-telemetry.peakRss as peakRss',
        'process-telemetry.peakVmem as peakVmem',
        'process-telemetry.memory as memory',
        'process-telemetry.rchar as rchar',
        'process-telemetry.wchar as wchar',
        'process-telemetry.readBytes as readBytes',
        'process-telemetry.writeBytes as writeBytes',
        'session.id as sessionId',
        'session.runName as runName',
        'process.id as processId',
        'process.label as processName',
      ])
      .limit(50)
      .orderBy('process.createdAt', 'DESC')
      .getRawMany<TAnalytic>();

    return result;
  }

  /* ------------------ ARTIFACTS ------------------ */

  async createArtifact(artifact: TArtifact) {
    const newArtifact = this.artifactsRepository.create({
      sessionId: artifact.sessionId,
      name: artifact.name,
      uri: artifact.uri,
      size: artifact.size,
      permissions: artifact.permissions,
      fileSystem: artifact.fileSystem,
      data: artifact.data,
      hash: artifact.hash,
    });
    await this.artifactsRepository.save(newArtifact);
  }

  async getArtifacts(sessionId: number): Promise<TArtifact[]> {
    const artifacts = await this.artifactsRepository.find({
      where: { sessionId: sessionId },
    });
    if (!artifacts) {
      throw new NotFoundException(
        `Artifacts with session id ${sessionId} not found`,
      );
    }
    return artifacts;
  }
}
