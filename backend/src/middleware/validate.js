export const validate = (schema) => (req, _res, next) => {
    try {
        req.body = schema.parse(req.body ?? {});
        next();
    } catch (e) {
        next({ status: 400, message: e.errors?.[0]?.message || 'Invalid request body' });
    }
};

export const validateParams = (schema) => (req, _res, next) => {
    try {
        req.params = schema.parse(req.params ?? {});
        next();
    } catch (e) {
        next({ status: 400, message: e.errors?.[0]?.message || 'Invalid route parameter' });
    }
};
