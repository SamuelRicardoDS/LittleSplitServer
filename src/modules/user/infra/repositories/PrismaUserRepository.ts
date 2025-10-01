import { User } from "@prisma/client";
import { IUserRepository } from "../../repositories/IUserRepository";
import { prisma } from "../../../../shared/prisma/prisma";

export class PrismaUserRepository implements IUserRepository {
    createUser(user: User): Promise<any> {
        return prisma.user.create({
            data: user
        });
    }
}