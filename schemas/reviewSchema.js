
const Joi = require('joi');



module.exports.createReviewSchema = Joi.object().keys({
    productId: Joi.number().integer().positive().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string(),
});

module.exports.updateReviewSchema = Joi.object().keys({
    productId: Joi.number().integer().positive(),
    rating: Joi.number().min(1).max(5),
    comment: Joi.string(),
});


module.exports.deleteReviewSchema = Joi.object().keys({
    id: Joi.number().integer().positive().required(),
});

