const Joi = require('joi');

module.exports.byIdUserSchema = Joi.object().keys({
    id: Joi.number().integer().positive().required()
})

module.exports.register = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string(),
    role: Joi.string().valid('admin', 'seller', 'customer').required(),
    street: Joi.string(),
    apartment: Joi.string(),
    city: Joi.string(),
})

module.exports.login = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

module.exports.getAllUsersSchema = Joi.object().keys({
    page: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(100).default(20),
})
.unknown(true)

module.exports.updateUser = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    phone: Joi.string(),
    role: Joi.string().valid('admin', 'seller', 'customer'),
    street: Joi.string(),
    apartment: Joi.string(),
    city: Joi.string(),
})

module.exports.UserReviewsSchema = Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().valid('rating').optional(),
    order: Joi.string().valid('asc', 'desc').default('desc')
});




