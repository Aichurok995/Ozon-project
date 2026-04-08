const express = require('express');
const router = express.Router();
const userSchema = require('../schemas/userSchema.js');
const joiSchemaValidation = require('../middleware/joiSchemaValidation.js');
const userController = require('../controllers/userController.js');
const tokenAndRoleValidation = require('../middleware/tokenAndRoleValidation.js')

router.post(
    '/register',
    joiSchemaValidation.validateBody(userSchema.register),
    userController.register,
);

router.post(
    '/login',
    joiSchemaValidation.validateBody(userSchema.login),
    userController.login,
);

router.get(
    '/',
    tokenAndRoleValidation.validateTokenAndRole('admin'),
    joiSchemaValidation.validateQueryParams(userSchema.getAllUsersSchema),
    userController.getAllUsers,
);

router.get(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['admin','customer', 'seller']),
    joiSchemaValidation.validateReqParams(userSchema.byIdUserSchema),
    userController.getById,
);

router.delete(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['admin','customer', 'seller']),
    joiSchemaValidation.validateReqParams(userSchema.byIdUserSchema),
    userController.deleteUser,
);

router.put(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['admin','customer', 'seller']),
    joiSchemaValidation.validateReqParams(userSchema.byIdUserSchema),
    joiSchemaValidation.validateBody(userSchema.updateUser),
    userController.updateUser,
);

router.get('/:id/reviews', 
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateReqParams(userSchema.byIdUserSchema),
    joiSchemaValidation.validateQueryParams(userSchema.UserReviewsSchema),
    userController.getUserReviews
)

module.exports = router