import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/user.entity';

@Injectable() //makes it a singleton that can be shared across app
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository,
    ) {}

    getTasks(filterDto: GetTasksFilterDto, user: User) {
        return this.tasksRepository.getTaks(filterDto, user);
    }

    async getTaskById(id: string, user: User) {
        return this.tasksRepository.getTaskById(id, user);
    }

    createTask(createTaskDto: CreateTaskDto, user: User) {
        return this.tasksRepository.createTask(createTaskDto, user);
    }

    async deleteTask(id: string, user: User) {
        const res = await this.tasksRepository.deleteTask(id, user);
        if (res.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User) {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }
}
