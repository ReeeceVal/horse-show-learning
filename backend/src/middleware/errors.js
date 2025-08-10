// Simple ApiError class to carry status codes
export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export function notFound(req, res, next) {
    next(new ApiError(404, `Not Found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
    const status = err.status || 500;
    const body = {
        status: 'error',
        message: err.message || 'Internal Server Error',
    };
    if (process.env.NODE_ENV !== 'production' && err.stack) body.stack = err.stack;
    res.status(status).json(body);
}