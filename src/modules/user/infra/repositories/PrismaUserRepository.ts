import { Prisma, User } from "@prisma/client";
import { IUserRepository } from "../../repositories/IUserRepository";
import { prisma } from "../../../../shared/prisma/prisma";

export class PrismaUserRepository implements IUserRepository {
    createUser(user: Prisma.UserCreateInput): Promise<any> {
        return prisma.user.create({
            data: user
        });
    }

    userAlreadyExists(email: string): Promise<boolean> {
        return prisma.user.findFirst({
            where: {
                email: email
            }
        }).then((user) => {
            return !!user;
        });
    }
}