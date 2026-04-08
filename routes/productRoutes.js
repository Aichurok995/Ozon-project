const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController.js');
const tokenAndRoleValidation = require('../middleware/tokenAndRoleValidation.js')
const joiSchemaValidation = require('../middleware/joiSchemaValidation.js');
const productSchema = require('../schemas/productSchema.js');
const imageUpload = require('../middleware/imageUpload.js');
const imageValidation = require('../middleware/imageValidation.js');

router.post(
    '/',
    tokenAndRoleValidation.validateTokenAndRole(['seller']),
    imageUpload.productUpload.single('image'),
    imageValidation.validateImage,
    joiSchemaValidation.validateBody(productSchema.createProductSchema),
    productController.createProduct,
);

router.get(
    '/',
    tokenAndRoleValidation.validateTokenAndRole(['seller', 'admin', 'customer']),
    joiSchemaValidation.validateQueryParams(productSchema.getAllProducts),
    productController.getAllProducts,
)

router.get(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['seller', 'admin', 'customer']),
    joiSchemaValidation.validateReqParams(productSchema.getById),
    productController.getById,
);

router.delete(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['seller', 'admin']),
    joiSchemaValidation.validateReqParams(productSchema.getById),
    productController.deleteProduct,
);

router.put(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['seller', 'admin']),
    imageUpload.productUpload.single('image'),
    joiSchemaValidation.validateReqParams(productSchema.getById),
    joiSchemaValidation.validateBody(productSchema.updateProductSchema),
    productController.updateProduct,
);


router.get(
    '/:id/reviews',
     tokenAndRoleValidation.validateTokenAndRole(['admin', 'customer', 'seller']),
    joiSchemaValidation.validateReqParams(productSchema.getById),
    joiSchemaValidation.validateQueryParams(productSchema.ProductReviewsSchema),
    productController.getProductReviews
);

router.post('/:id/sale',
    tokenAndRoleValidation.validateTokenAndRole(['admin']),
    joiSchemaValidation.validateReqParams(productSchema.getById),
    joiSchemaValidation.validateBody(productSchema.createProductForSale),
    productController.createProductForSale
)

router.delete('/:id/sale',
    tokenAndRoleValidation.validateTokenAndRole(['admin']),
    joiSchemaValidation.validateReqParams(productSchema.getById),
    productController.deleteProductForSale
)

router.get('/sale/true',
    tokenAndRoleValidation.validateTokenAndRole(['admin', 'customer']),
     productController.getProductsForSale
)

router.put('/:id/sale',
    tokenAndRoleValidation.validateTokenAndRole(['admin']),
    joiSchemaValidation.validateReqParams(productSchema.getById),
    joiSchemaValidation.validateBody(productSchema.updateProductForSale),
    productController.updateSaleProduct
)

module.exports = router;