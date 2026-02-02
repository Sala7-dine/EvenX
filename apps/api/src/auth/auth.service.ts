import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/user.schema';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: UserDocument) {
        const payload = { email: user.email, sub: user._id };
        return {
            user,
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(user: CreateUserDto) {
        if (!user.password) {
            throw new Error('Password is required');
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = await this.usersService.create({
            ...user,
            password: hashedPassword,
        });
        const result = newUser instanceof User ? newUser : (newUser as any).toObject?.() || newUser;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = result;
        return rest;
    }
}
