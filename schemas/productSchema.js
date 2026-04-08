const Joi = require('joi');

module.exports.createProductSchema = Joi.object().keys({
    name: Joi.string().required(),
    brand: Joi.string().required(),
    price: Joi.number().required(),
    countInStock: Joi.number().required(),
    categoryId: Joi.number().integer().positive().required()
});

module.exports.getAllProducts = Joi.object().keys({
    page: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().min(1).max(100).default(20),
    })
    .unknown(true);


module.exports.getById = Joi.object().keys({
    id: Joi.number().integer().positive().required()
});

module.exports.updateProductSchema = Joi.object().keys({
    name: Joi.string(),
    brand: Joi.string(),
    price: Joi.number(),
    countInStock: Joi.number(),
    categoryId: Joi.number().integer().positive()
});

module.exports.ProductReviewsSchema = Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    rating: Joi.number().integer().min(1).max(5).optional()
});

module.exports.createProductForSale = Joi.object().keys({
    salePercent: Joi.number().integer().min(0).max(90),
    saleEndDate: Joi.date().min('now')
})

module.exports.updateProductForSale = Joi.object().keys({
    salePercent: Joi.number().integer().min(0).max(90),
    saleEndDate: Joi.date().min('now')
})
