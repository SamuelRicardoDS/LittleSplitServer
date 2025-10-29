import { PrismaUserRepository } from "../../infra/repositories/PrismaUserRepository";
import { AuthenticateUserUseCase } from "../AuthenticateUserUseCase";

export function makeAuthenticateUser() {
  const userRepository = new PrismaUserRepository();
  return new AuthenticateUserUseCase(userRepository);
}
