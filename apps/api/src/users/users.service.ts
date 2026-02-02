import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findOne(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).lean();
    }

    async create(user: CreateUserDto): Promise<User> {
        return this.userModel.create(user);
    }
}
