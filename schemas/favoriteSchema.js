const Joi = require('joi')



module.exports.createFavoriteSchema = Joi.object().keys({
    productId: Joi.number().integer().positive().required()
})

module.exports.deleteFavoriteSchema = Joi.object().keys({
   id: Joi.number().integer().positive().required()
})

module.exports.getFavoriteSchema = Joi.object().keys({
   page: Joi.number().integer().min(1).default(1),
   limit: Joi.number().integer().min(1).max(100).default(20),
})

module.exports.checkFavoriteSchema = Joi.object().keys({
   id: Joi.number().integer().positive().required()
})
