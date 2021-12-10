import {
    ConflictException,
    InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials-dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

enum Errors {
    DUPLICATED_USERNAME = '23505',
}

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto) {
        const { username, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({ username, password: hashedPassword });
        try {
            await this.save(user);
        } catch (error) {
            if (error.code === Errors.DUPLICATED_USERNAME) {
                throw new ConflictException('Username already exists');
            } else {
                console.log(error.code);
                throw new InternalServerErrorException();
            }
        }
    }
}
