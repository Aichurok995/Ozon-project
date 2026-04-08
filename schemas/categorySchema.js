const Joi = require('joi')


module.exports.createCategory = Joi.object().keys({
    name: Joi.string().required()
})

module.exports.updateCategorySchema = Joi.object().keys({
    name: Joi.string()
})

module.exports.byIdCategorySchema = Joi.object().keys({
    id: Joi.number().integer().positive().required()
})