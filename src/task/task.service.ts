import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskHistory } from 'src/models/entities/task-history.entity';
import { Task, TaskStatus } from 'src/models/entities/task.entity';
import { Account } from 'src/models/entities/account.entity';
import { AccountService } from 'src/account/account.service';
import { UserProfile } from 'src/models/interfaces/userProfile.interface';


@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,
        private accountService: AccountService,
        @InjectRepository(TaskHistory)
        private taskHistoryRepository: Repository<TaskHistory>,
    ) { }

    async create(taskData: Partial<Task>): Promise<Task> {
        const task = this.taskRepository.create(taskData);
        return await this.taskRepository.save(task);
    }

    async findAll(
        page: number,
        limit: number,
        sortBy: string,
        search?: string,
        status?: string
    ): Promise<any[]> {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');

        // Apply search filter if provided
        if (search) {
            queryBuilder.where(
                '(task.name LIKE :search OR task.description LIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Apply status filter if provided
        if (status) {
            queryBuilder.andWhere('task.status = :status', { status });
        }

        // Add pagination and sorting
        const tasks = await queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy(`task.${sortBy}`, 'ASC')
            .getMany();

        // Fetch users based on userId
        const userIds = tasks.map(task => task.userId);
        const users = await this.accountService.findByIds(userIds); // Assuming accountService has a method to find users by IDs

        // Create a mapping of userId to user
        const userMap = new Map(users.map(user => [user.id, user]));

        // Return tasks along with user details
        const response = tasks.map(task => ({
            task,
            user: userMap.get(task.userId), // Get user by userId
        }));

        return response;
    }

    async findTaskById(id: string): Promise<{ task: Task; user: UserProfile, history: TaskHistory[] }> {
        // Fetch the task by ID
        const task = await this.taskRepository.findOne({ where: { id } });

        // console.log("ID", id);
        // console.log("GTask", task);

        // Check if the task exists
        if (!task) {
            throw new NotFoundException('Task not found');
        }

        // Convert the id to a number if TaskHistory expects it
        const taskId = task.id;
        if (!taskId) {
            throw new NotFoundException('TaskId not found');
        }

        const user = await this.accountService.validateUserById(task.userId); // Assuming accountService has a method to find users by IDs
        if (!user) {
            throw new NotFoundException('TaskId not found');
        }

        // Fetch the task history using the task's ID
        const history = await this.taskHistoryRepository.find({ where: { taskId: taskId } });

        // Return the task and its history
        return { task, user, history };
    }

    async updateTaskById(id: string, updateData: Partial<Task>, changeReason: string): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        if (!task) {
            throw new Error('Task not found');
        }
        const previousStatus = task.status;


        // Update the task
        Object.assign(task, updateData);

        // Track history
        const history = this.taskHistoryRepository.create({
            taskId: id,
            previousStatus,
            changeReason,
        });
        await this.taskHistoryRepository.save(history);

        return await this.taskRepository.save(task);
    }

    async softDeleteTaskById(id: string, userId: string): Promise<void> {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        if (!task) {
            throw new Error('Task not found');
        }

        task.deletedAt = new Date();
        task.userId = userId;
        task.status = TaskStatus.DELETED;
        await this.taskRepository.save(task);
    }
}