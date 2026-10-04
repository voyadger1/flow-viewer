import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Session } from './session.entity';

@Entity('edges')
export class Edges {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  sessionId: number;

  @Column({ type: 'text' })
  edgesJson: string;

  // ----------------- DB -----------------

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ----------------- Connection -----------------

  @ManyToOne(() => Session, (session) => session.edges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session!: Session;
}
