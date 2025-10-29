import { Group, Prisma } from "@prisma/client";
import { prisma } from "../../../../shared/prisma/prisma";
import { IGroupRepository } from "../../repositories/IGroupRepository";


export class PrismaGroupRepository implements IGroupRepository {
    create(group: Prisma.GroupCreateInput): Promise<Group> {
        return prisma.group.create({
            data: group
        });
    }
}