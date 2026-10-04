import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { Process } from './process.entity';

@Entity('artifacts')
export class Artifacts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  sessionId: number;

  @Column({ type: 'integer', nullable: true })
  processId: number;

  // ----------------- Data -----------------

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  uri: string;

  @Column({ type: 'integer' })
  size: number;

  @Column({ type: 'varchar', length: 9, nullable: true })
  permissions?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileSystem?: string;

  @Column({ type: 'text', nullable: true })
  data?: string;

  @Column({ type: 'varchar', length: 255 })
  hash: string;

  // ----------------- DB -----------------

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ----------------- Connection -----------------

  @ManyToOne(() => Session, (session) => session.artifacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session!: Session;

  @OneToOne(() => Process, (process) => process.artifacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'processId' })
  process!: Process;
}
