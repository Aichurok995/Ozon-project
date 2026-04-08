const express = require('express');
const router = express.Router();
const joiSchemaValidation = require('../middleware/joiSchemaValidation.js');
const orderSchema = require('../schemas/orderSchema.js');
const orderController = require('../controllers/orderController.js');
const tokenAndRoleValidation = require('../middleware/tokenAndRoleValidation.js')

router.post(
    '/',
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateBody(orderSchema.createOrderSchema),
    orderController.createOrder,
);

router.get('/', tokenAndRoleValidation.validateTokenAndRole(['customer']), orderController.getAllOrder);

router.get(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateReqParams(orderSchema.OrderById),
    orderController.getById,
);

router.put(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateBody(orderSchema.updateOrder),
    joiSchemaValidation.validateReqParams(orderSchema.OrderById),
    orderController.updateOrder,
);

router.delete(
    '/:id',
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateReqParams(orderSchema.OrderById),
    orderController.deleteOrder
);

router.get('/get/totalsales',
    tokenAndRoleValidation.validateTokenAndRole(['admin', 'seller']),
    orderController.getTotalSales
)

module.exports = router;
