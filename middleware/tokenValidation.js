const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

module.exports.validateToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new Error('Token is missing');
        }
        const token = req.headers.authorization.split('Bearer')[1].trim();
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.payload = {};
        req.payload.userId = decoded.id;
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error('User with token not found');
        }
        return next();
    } catch (error) {
        return res.status(400).send(error.message);
    }
};
