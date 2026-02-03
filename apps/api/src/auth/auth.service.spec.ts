import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.schema';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let usersService: any;
    let jwtService: any;

    const mockUser = {
        _id: 'someId',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'PARTICIPANT',
        toObject: jest.fn().mockReturnValue({
            _id: 'someId',
            email: 'test@example.com',
            name: 'Test User',
            role: 'PARTICIPANT',
        }),
    };

    const mockUsersService = {
        findOne: jest.fn(),
        create: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mockToken'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            mockUsersService.create.mockResolvedValue(mockUser);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const dto = { email: 'new@example.com', password: 'pass', name: 'New' };
            const result = await service.register(dto);

            expect(usersService.create).toHaveBeenCalled();
            expect(result).toHaveProperty('email', 'test@example.com');
        });

        it('should throw ConflictException if usersService.create throws', async () => {
            mockUsersService.create.mockRejectedValue(new ConflictException());
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

            const dto = { email: 'test@example.com', password: 'pass', name: 'Test' };
            await expect(service.register(dto)).rejects.toThrow(ConflictException);
        });
    });

    describe('validateUser', () => {
        it('should return user (without password) if validation succeeds', async () => {
            mockUsersService.findOne.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser('test@example.com', 'correctPass');

            expect(result).toEqual({
                _id: 'someId',
                email: 'test@example.com',
                name: 'Test User',
                role: 'PARTICIPANT',
                toObject: expect.any(Function),
            });
            expect(result.password).toBeUndefined();
        });

        it('should return null if user not found', async () => {
            mockUsersService.findOne.mockResolvedValue(null);
            const result = await service.validateUser('wrong@example.com', 'pass');
            expect(result).toBeNull();
        });

        it('should return null if password mismatch', async () => {
            mockUsersService.findOne.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.validateUser('test@example.com', 'wrongPass');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access_token', async () => {
            const result = await service.login(mockUser as any);
            expect(jwtService.sign).toHaveBeenCalled();
            expect(result).toEqual({
                user: mockUser,
                access_token: 'mockToken'
            });
        });
    });
});
