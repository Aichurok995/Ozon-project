const express = require('express')
const router = express.Router()
const tokenAndRoleValidation = require('../middleware/tokenAndRoleValidation.js')
const favoriteSchema = require('../schemas/favoriteSchema.js')
const favoriteController = require('../controllers/favoriteController.js')
const joiSchemaValidation = require('../middleware/joiSchemaValidation.js')

router.post('/', 
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateBody(favoriteSchema.createFavoriteSchema),
    favoriteController.createFavorite
)

router.delete('/:id', 
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateReqParams(favoriteSchema.deleteFavoriteSchema),
    favoriteController.deleteProductFromFavorite
)

router.get('/', 
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateQueryParams(favoriteSchema.getFavoriteSchema),
    favoriteController.getFavoriteProducts
)

router.get('/check/:id',
    tokenAndRoleValidation.validateTokenAndRole(['customer']),
    joiSchemaValidation.validateReqParams(favoriteSchema.checkFavoriteSchema),
    favoriteController.checkFavoriteProduct
)

module.exports = router
