import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import type { TProcessStatus } from '@flowviewer/shared/types/status';
import { Edges } from './edges.entity';
import { Process } from './process.entity';
import { Artifacts } from './artifact.entity';

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  // ----------------- Meta -----------------

  @Column({ type: 'varchar', default: 'CREATED' })
  status: TProcessStatus;

  @Column({ type: 'integer' })
  startTime: number;

  @Column({ type: 'integer', nullable: true })
  completedTime?: number;

  // ----------------- NextFlow -----------------

  @Column({ type: 'varchar', length: 255 })
  uniqueId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  workflowName: string;

  @Column({ type: 'text', nullable: true })
  sessionInfo: string;

  @Column({ type: 'varchar', length: 255 })
  scriptName: string;

  @Column({ type: 'varchar', length: 255 })
  runName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  runBy: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile: string;

  @Column({ type: 'boolean', nullable: true })
  ansiLog: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  binDir: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bucketDir: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  workDir: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  commandLine: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  commitId: string;

  @Column({ type: 'integer', nullable: true })
  poolSize: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resolvedConfig: string;

  // ----------------- DB -----------------

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ----------------- Connection -----------------

  @OneToMany(() => Process, (processes) => processes.session)
  processes!: Process[];

  @OneToMany(() => Edges, (edges) => edges.session)
  edges!: Edges[];

  @OneToMany(() => Artifacts, (artifacts) => artifacts.session)
  artifacts!: Artifacts[];
}
