import { Request, Response } from "express";
import { makeAuthenticateUser } from "../../../useCases/factories/makeAuthenticateUser";
import { logger } from "../../../../../shared/logger";
import { IUserRepository } from "../../../repositories/IUserRepository";
import { AppError } from "../../../../../shared/errors/AppError";

export class AuthenticateUserController {
    constructor(private userRepository: IUserRepository) {}

    async execute(req: Request, res: Response): Promise<Response | void> {
        try {
            const { email, password } = req.body;
            
            if (!email || !password) {
                return res.status(400).json({ 
                    error: 'Email e senha são obrigatórios' 
                });
            }

            logger.info(`Tentativa de autenticação para email: ${email}`);

            const authenticateUser = makeAuthenticateUser();
            const result = await authenticateUser.execute({ email, password });
            
            return res.status(200).json(result);
        } catch (error) {
            logger.error('Erro na autenticação:', error);
            
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ 
                    error: error.message 
                });
            }
            
            return res.status(500).json({ 
                error: 'Erro interno do servidor' 
            });
        }
    }
}