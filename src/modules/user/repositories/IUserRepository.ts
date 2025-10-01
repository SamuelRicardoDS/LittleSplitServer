import { User } from "@prisma/client";

export interface IUserRepository {
    createUser(user: User): Promise<any>;
}