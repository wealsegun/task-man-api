import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Task } from './task.entity';


@Entity()
export class TaskHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    taskId: string;

    @Column()
    previousStatus: string;

    @Column()
    changeReason: string;

    @CreateDateColumn()
    timestamp: Date;
}