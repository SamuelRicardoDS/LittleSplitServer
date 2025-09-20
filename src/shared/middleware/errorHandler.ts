import { Request, Response } from "express";
import { BaseError } from "../errors/BaseError";


export const ErrorHandler = (err: Error, req: Request, res: Response, next: Function) => {
    
    if(err instanceof BaseError){
        return res.status(err.statusCode).json({
            errors: err.serializeErrors()
        })
    }
    
    console.error("ERROR GENERATED:", err);
    res.status(500).json({
        errors: [{
            message: "Internal Server Error"
        }]
    })
}