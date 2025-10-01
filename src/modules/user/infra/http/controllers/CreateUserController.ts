import { Request, Response } from "express";
import { makeCreateUser } from "../../../useCases/factories/makeCreateUser";
import { IUserRepository } from "../../../repositories/IUserRepository";

export class createUserController {
    constructor(private userRepository: IUserRepository) {}
    async execute(req: Request, res: Response): Promise<Response> {
        const createUser = makeCreateUser(this.userRepository);
        const user = req.body;
        try {
            const result = await createUser.execute(user);
            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            });
        }
    }
}
    