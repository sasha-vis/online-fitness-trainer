import { Request, Response, NextFunction } from 'express';
import { createApiResponse } from '@utils/api-response.js';

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('🚨 Error:', error);

    let statusCode = 500;
    let message = 'Internal server error';

    if (error.name === 'EntityNotFoundError') {
        statusCode = 404;
        message = 'Resource not found';
    }

    res.status(statusCode).json(createApiResponse(null, message));
    next();
};
