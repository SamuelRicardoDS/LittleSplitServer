import { IUserRepository } from "../repositories/IUserRepository";
import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ValidationError } from "../../../shared/errors/ValidationError";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: Prisma.UserCreateInput): Promise<User> {
    const userAlreadyExists = await this.userRepository.userAlreadyExists(user.email);

    if (userAlreadyExists) {
      throw new Error('User already exists');
    }

    if (!user.password || user.password.length === 0) {
      throw new ValidationError([{ message: 'Password is required', field: 'password' }]);
    }
    if (user.password.length < 8) {
      throw new ValidationError([{ message: 'Password must be at least 8 characters long', field: 'password' }]);
    }
    if (!/[A-Z]/.test(user.password)) {
      throw new ValidationError([{ message: 'Password must contain at least one uppercase letter', field: 'password' }]);
    }
    if (!/[a-z]/.test(user.password)) {
      throw new ValidationError([{ message: 'Password must contain at least one lowercase letter', field: 'password' }]);
    }
    if (!/[0-9]/.test(user.password)) {
      throw new ValidationError([{ message: 'Password must contain at least one number', field: 'password' }]);
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(user.password)) {
      throw new ValidationError([{ message: 'Password must contain at least one special character', field: 'password' }]);
    }

    const normalizedEmail = user.email.toLowerCase().trim();
    const hashPassword = await bcrypt.hash(user.password, 8);

    const userData: Prisma.UserCreateInput = {
        username: user.username,
        email: normalizedEmail,
        password: hashPassword,
        status: 'ACTIVE',
        createdAt: new Date(),
    };

    return this.userRepository.createUser(userData);
  }
}
