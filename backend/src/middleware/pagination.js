export function pageParams(req, _res, next) {
    const limit = Math.min(Math.max(parseInt(req.query.limit || '25', 10), 1), 100);
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);
    req.page = { limit, offset };
    next();
}


