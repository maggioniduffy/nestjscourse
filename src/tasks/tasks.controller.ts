import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksService } from './tasks.service';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService: TasksService) {}

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User) {
        this.logger.verbose(
            `User "${
                user.username
            }" retrieving all tasks. Filters "${JSON.stringify(filterDto)}"`,
        );
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/:id')
    async getTaskById(@Param('id') id: string, @GetUser() user: User) {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
        this.logger.verbose(
            `User "${user.username}" creating task. Data: "${JSON.stringify(
                createTaskDto,
            )}"`,
        );
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTask(@Param('id') id: string, @GetUser() user: User) {
        return this.taskService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @GetUser() user: User,
    ) {
        const { status } = updateTaskStatusDto;
        return this.taskService.updateTaskStatus(id, status, user);
    }
}
