const jwt = require('jsonwebtoken');


module.exports.validateTokenAndRole = function (allowedRoles = []) {
    return (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('Token is missing');
        }
        const token = req.headers.authorization.split('Bearer')[1].trim();
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.payload = {};
        req.payload.userId = decoded.id;
        req.payload.role = decoded.role
        if(!allowedRoles.includes(req.payload.role)){
            return res.status(403).json({message: 'Access denied'})
        }
        next();
    } catch (error) {
        return res.status(401).send(error.message);
    }
};
}
