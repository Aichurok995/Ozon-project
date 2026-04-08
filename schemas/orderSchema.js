const Joi = require('joi');


module.exports.createOrderSchema = Joi.object().keys({
    address: Joi.string().required(),
    phone: Joi.string().required(),
    products: Joi.array().required().min(1),
});

module.exports.OrderById = Joi.object().keys({
    id: Joi.number().integer().positive()
});

module.exports.updateOrder = Joi.object().keys({
    address: Joi.string(),
    phone: Joi.string(),
    products: Joi.array(),
});
