const express = require('express');
const router = express.Router();
const joiSchemaValidation = require('../middleware/joiSchemaValidation.js');
const categorySchema = require('../schemas/categorySchema.js');
const tokenAndRoleValidation = require('../middleware/tokenAndRoleValidation.js')
const categoryController = require('../controllers/categoryController.js');
const imageUpload = require('../middleware/imageUpload.js');
const imageValidation = require('../middleware/imageValidation.js');

router.post(
    '/',
    tokenAndRoleValidation.validateTokenAndRole(['admin']),
    imageUpload.categoryUpload.single('icon'),
    imageValidation.validateImage,
    joiSchemaValidation.validateBody(categorySchema.createCategory),
    categoryController.createCategory,
);

router.get(
    '/',
    tokenAndRoleValidation.validateTokenAndRole(['admin', 'customer', 'seller']),
    categoryController.getAllCategory,
);

router.get(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['admin', 'customer', 'seller']),
    joiSchemaValidation.validateReqParams(categorySchema.byIdCategorySchema),
    categoryController.getById,
);

router.put(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['admin']),
    imageUpload.categoryUpload.single('icon'),
    joiSchemaValidation.validateReqParams(categorySchema.byIdCategorySchema),
    joiSchemaValidation.validateBody(categorySchema.updateCategorySchema),
    categoryController.updateCategory,
);

router.delete(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['admin']),
    joiSchemaValidation.validateReqParams(categorySchema.byIdCategorySchema),
    categoryController.deleteCategory,
);

module.exports = router;