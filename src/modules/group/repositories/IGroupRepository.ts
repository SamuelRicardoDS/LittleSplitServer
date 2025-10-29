import { Group, Prisma } from "@prisma/client";


export interface IGroupRepository {
    create(group: Prisma.GroupCreateInput): Promise<Group>;
}