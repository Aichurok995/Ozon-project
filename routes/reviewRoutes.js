const express = require('express');
const router = express.Router();
const joiSchemaValidation = require('../middleware/joiSchemaValidation.js');
const reviewSchema = require('../schemas/reviewSchema.js');
const reviewController = require('../controllers/reviewController.js');
const tokenAndRoleValidation = require('../middleware/tokenAndRoleValidation.js');

router.post(
    '/',
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateBody(reviewSchema.createReviewSchema),
    reviewController.createReview,
);

router.put('/:id',
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateBody(reviewSchema.updateReviewSchema),
    reviewController.updateReview
)

router.delete('/:id', 
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateReqParams(reviewSchema.deleteReviewSchema),
    reviewController.deleteReview
)


module.exports = router

