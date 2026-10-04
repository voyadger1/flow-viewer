import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { ProcessTelemetry } from './process-telemetry.entity';
import { Artifacts } from './artifact.entity';

@Entity('processes')
export class Process {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  vertexId: number;

  @Column({ type: 'integer' })
  sessionId: number;

  @Column({ type: 'integer', nullable: true })
  processId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  label: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  type: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  status: string;

  @Column({ type: 'integer', nullable: true })
  startTime: number;

  @Column({ type: 'integer', nullable: true })
  completeTime: number;

  // ----------------- DB -----------------

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ----------------- Connection -----------------

  @ManyToOne(() => Session, (session) => session.processes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session!: Session;

  @OneToOne(
    () => ProcessTelemetry,
    (processTelemetry) => processTelemetry.process,
  )
  telemetry!: ProcessTelemetry;

  @OneToMany(() => Artifacts, (artifacts) => artifacts.session)
  artifacts!: Artifacts[];
}
