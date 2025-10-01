import { IUserRepository } from "../repositories/IUserRepository";
import { User } from '@prisma/client';



export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(user: User): Promise<User> {
    return this.userRepository.createUser(user);
  }
}
