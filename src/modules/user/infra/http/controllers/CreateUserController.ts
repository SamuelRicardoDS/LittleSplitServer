// modules/user/infra/http/controllers/CreateUserController.ts
import { Request, Response, NextFunction } from "express";
import { makeCreateUser } from "../../../useCases/factories/makeCreateUser";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { Prisma, User } from "@prisma/client";
import { logger } from "../../../../../shared/logger";

export class createUserController {
    constructor(private userRepository: IUserRepository) {}

    async execute(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const createUser = makeCreateUser(this.userRepository);
            const userData: Prisma.UserCreateInput = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                status: 'ACTIVE',
                createdAt: new Date(),
            };

            logger.info(`Requisição de criação de usuário recebida para email: ${userData.email}`);
            
            const result = await createUser.execute(userData);
            
            return res.status(201).json({
                success: true,
                data: result
            });
        } catch (error) {
            logger.error(`Erro no controller de criação de usuário: ${error instanceof Error ? error.message : 'Unknown error'}`);
            next(error);
        }
    }
}