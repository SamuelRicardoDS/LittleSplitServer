import { Prisma, User } from "@prisma/client";

export interface IUserRepository {
    createUser(user: Prisma.UserCreateInput): Promise<any>;
    userAlreadyExists(email: string): Promise<boolean>;
    findByEmail(email: string): Promise<User | null>;
    updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}