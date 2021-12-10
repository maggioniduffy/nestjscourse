import {
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { User } from '../auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
    private logger = new Logger('TasksRepository', { timestamp: true });

    async createTask(createTaskDto: CreateTaskDto, user: User) {
        const { title, description } = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user,
        });

        await this.save(task);
        return task;
    }

    async deleteTask(id: string, user: User) {
        return await this.delete({ id, user });
    }

    async getTaskById(id: string, user: User) {
        const found = await this.findOne({
            where: {
                id,
                user,
            },
        });

        if (!found) {
            this.throwIdNotFound(id);
        }

        return found;
    }

    async getTaks(filterDto: GetTasksFilterDto, user: User) {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where({ user });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for user "${
                    user.username
                }". Filters: "${JSON.stringify(filterDto)}`,
                error,
            );
            throw new InternalServerErrorException();
        }
    }

    private throwIdNotFound(id: string) {
        throw new NotFoundException(`Task with id: ${id} not found`);
    }
}
