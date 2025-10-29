import { Request, Response, NextFunction } from 'express';
import { prisma } from '../prisma/prisma';
import { verify, JwtPayload } from 'jsonwebtoken'
import { config } from '../../config/config';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        username: string;
    };
}

export const ensureAuthenticated = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                error: 'Token not provided'
            });
            return;
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            res.status(401).json({
                error: 'Token not provided'
            });
            return;
        }

        const decoded = verify(token, config.jwt.secret) as JwtPayload & { 
            tokenId: string 
        };
        const userId = decoded.sub;

        if (!userId) {
            res.status(401).json({
                error: 'Invalid token'
            });
            return;
        }

        const user = await prisma.user.findFirst({
            where: { 
                id: userId,
                currentTokenId: decoded.tokenId,
                status: 'ACTIVE'
            },
            select: { 
                id: true, 
                email: true,
                username: true,
                status: true 
            }
        });

        if (!user) {
            res.status(401).json({
                error: 'Invalid token or user not found'
            });
            return;
        }

        req.user = { 
            id: user.id, 
            email: user.email,
            username: user.username
        };

        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            error: error.message || 'Invalid token'
        });
        return;
    }
};