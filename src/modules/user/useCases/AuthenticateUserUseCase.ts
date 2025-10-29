import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../../../shared/errors/AppError";
import { IUserRepository } from "../repositories/IUserRepository";
import { config } from "../../../config/config";

interface AuthenticateRequest {
    email: string;
    password: string;
}

interface AuthenticateResponse {
    user: {
        id: string;
        email: string;
        username: string;
    };
    token: string;
}

export class AuthenticateUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute({ email, password }: AuthenticateRequest): Promise<AuthenticateResponse> {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user) {
            throw new AppError("Credenciais inválidas", 401);
        }

        const passwordMatched = await compare(password, user.password);
        
        if (!passwordMatched) {
            throw new AppError("Credenciais inválidas", 401);
        }

        if (user.status !== 'ACTIVE') {
            throw new AppError("Usuário inativo", 403);
        }

        const tokenId = uuidv4();
        
        await this.userRepository.updateUser(user.id, { 
            currentTokenId: tokenId,
            lastLogin: new Date()
        });

        const token = sign(
            {
                sub: user.id,
                email: user.email,
                tokenId: tokenId
            },
            config.jwt.secret
        );

        return {
            user: {
                id: user.id,
                email: user.email,
                username: user.username 
            },
            token
        };
    }
}