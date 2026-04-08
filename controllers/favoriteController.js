const favoriteService = require('../service/favoriteService.js')

module.exports.createFavorite = async (req,res) => {
    try {
    const responseFromService = await favoriteService.createFavorite(req.body,req.payload )
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.deleteProductFromFavorite = async (req,res) => {
    try {
    const responseFromService = await favoriteService.deleteProductFromFavorite(req.params,req.payload )
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.getFavoriteProducts = async (req,res) => {
    try {
    const responseFromService = await favoriteService.getFavoriteProducts(req.query, req.payload )
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.checkFavoriteProduct = async (req,res) => {
    try {
    const responseFromService = await favoriteService.checkFavoriteProduct(req.params, req.payload )
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

