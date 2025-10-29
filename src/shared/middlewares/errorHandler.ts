import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError";
import { logger } from "../logger";

export const ErrorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
): Response => {
    const errorInfo = {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query,
        ip: req.ip,
        timestamp: new Date().toISOString()
    };
    
    if (err instanceof BaseError) {
        logger.warn('Erro operacional:', errorInfo);
        
        return res.status(err.statusCode).json({
            success: false,
            errors: err.serializeErrors()
        });
    }
    
    logger.error('Erro não esperado:', errorInfo);
    
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    return res.status(500).json({
        success: false,
        errors: [{
            message: isDevelopment ? err.message : "Erro interno do servidor"
        }],
        ...(isDevelopment && { stack: err.stack })
    });
}