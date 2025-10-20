import { Prisma, User } from "@prisma/client";

export interface IUserRepository {
    createUser(user: Prisma.UserCreateInput): Promise<any>;
    userAlreadyExists(email: string): Promise<boolean>;
}