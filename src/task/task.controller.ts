import { Controller, Get, Post, Body, Param, Delete, Query, Patch, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from '../models/entities/task.entity';
import { ResponseUtil } from '../models/classes/response.util';
import { JwtAuthGuard } from '../account/jwt-account.guard';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Request() req, @Body() task: Partial<Task>) {
        const userId = req.user.id; // Extract userId from the JWT payload
        task.userId = userId;
        console.log(task);
        const newTask = await this.taskService.create(task);
        return ResponseUtil.sendSuccessResponse(201, 'Task created successfully', newTask);
    }

    @Get()
    async findAll(
        @Query('page') page: string = '1', // Default to page 1
        @Query('limit') limit: string = '10', // Default to limit 10
        @Query('sort') sort: string = 'createdAt', // Default sort by createdAt
        @Query('search') search?: string, // Optional search parameter
        @Query('status') status?: string // Optional status parameter
    ) {
        const tasks = await this.taskService.findAll(
            parseInt(page),
            parseInt(limit),
            sort,
            search,
            status
        );
        return ResponseUtil.sendSuccessResponse(200, 'Tasks retrieved successfully', tasks);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        // console.log(id);
        const task = await this.taskService.findTaskById(id);
        if (!task) {
            ResponseUtil.sendErrorResponse(404, 'Task not found');
        }
        return ResponseUtil.sendSuccessResponse(200, 'Task retrieved successfully', task);
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id/history')
    async history(@Param('id') id: string) {
        console.log(id);
        const task = await this.taskService.findTaskById(id);
        console.log(task);
        if (!task) {
            ResponseUtil.sendErrorResponse(404, 'Task not found');
        }
        return ResponseUtil.sendSuccessResponse(200, 'Task retrieved successfully', task);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Request() req, @Param('id') id: string, @Body() task: Partial<Task>) {
        const userId = req.user.id;
        task.userId = userId;
        task.updatedAt = new Date();
        const updatedTask = await this.taskService.updateTaskById(id, task, 'Updated task');
        return ResponseUtil.sendSuccessResponse(200, 'Task updated successfully', updatedTask);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async softDelete(@Request() req, @Param('id') id: string) {
        const userId = req.user.id;
        if (userId === null) {
            return ResponseUtil.sendErrorResponse(401, 'You are not authorised to delete ');
        }
        await this.taskService.softDeleteTaskById(id, userId);
        return ResponseUtil.sendSuccessResponse(200, 'Task deleted successfully', null);
    }
}