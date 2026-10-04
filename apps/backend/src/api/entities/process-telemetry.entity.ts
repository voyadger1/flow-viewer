import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Process } from './process.entity';

@Entity('process-telemetry')
export class ProcessTelemetry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  sessionId: number;

  @Column({ type: 'integer' })
  processId: number;

  // ----------------- Data -----------------

  @Column({ type: 'varchar', length: 255, nullable: true })
  hash: string;

  @Column({ type: 'integer', nullable: true })
  realtime: number;

  @Column({ type: 'integer', nullable: true })
  startTime: number;

  @Column({ type: 'integer', nullable: true })
  completeTime: number;

  @Column({ type: 'integer', nullable: true })
  cpuPercent: number;

  @Column({ type: 'integer', nullable: true })
  cpus: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cpu_model: string;

  @Column({ type: 'integer', nullable: true })
  mem: number;

  @Column({ type: 'integer', nullable: true })
  rss: number;

  @Column({ type: 'integer', nullable: true })
  vmem: number;

  @Column({ type: 'integer', nullable: true })
  peakRss: number;

  @Column({ type: 'integer', nullable: true })
  peakVmem: number;

  @Column({ type: 'integer', nullable: true })
  memory: number;

  @Column({ type: 'integer', nullable: true })
  rchar: number;

  @Column({ type: 'integer', nullable: true })
  wchar: number;

  @Column({ type: 'integer', nullable: true })
  readBytes: number;

  @Column({ type: 'integer', nullable: true })
  writeBytes: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  container: string;

  @Column({ type: 'integer', nullable: true })
  disk: number;

  @Column({ type: 'text', nullable: true })
  module: string;

  @Column({ type: 'integer', nullable: true })
  exitStatus: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hostname: string;

  @Column({ type: 'integer', nullable: true })
  inv_ctxt: number;

  @Column({ type: 'integer', nullable: true })
  vol_ctxt: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  error_action: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  queue: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  scratch: string;

  // ----------------- DB -----------------

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ----------------- Connection -----------------

  @OneToOne(() => Process, (process) => process.telemetry, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'processId' })
  process!: Process;
}
