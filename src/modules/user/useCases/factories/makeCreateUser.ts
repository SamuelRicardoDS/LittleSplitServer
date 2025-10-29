import { CreateUserUseCase } from "../CreateUserUseCase";
import { IUserRepository } from "../../repositories/IUserRepository";

export const makeCreateUser = (userRepository: IUserRepository): CreateUserUseCase => {
    return new CreateUserUseCase(userRepository);
}