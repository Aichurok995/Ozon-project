const productService = require('../service/productService.js')

module.exports.createProduct = async (req, res) => {
try {
    const responseFromService = await productService.createProduct(req)
    console.log(req.payload.userId)
    return res.status(200).json({success: true, data: responseFromService})
} catch (error) {
    return res.status(400).json({success: false, message: error.message})
}}

module.exports.getAllProducts = async (req, res) => {
try {
    const responseFromService = await productService.getAllProducts(req.query)
    return res.status(200).json({success: true, data: responseFromService})
} catch (error) {
    return res.status(400).json({success: false, message: error.message})
}}

module.exports.getById = async (req, res) => {
try {
    const responseFromService = await productService.getById(req.params)
    return res.status(200).json({success: true, data: responseFromService})
} catch (error) {
    return res.status(400).json({success: false, message: error.message})
}}

module.exports.deleteProduct = async (req, res) => {
try {
    const responseFromService = await productService.deleteProduct(req.params)
    return res.status(200).json({success: true, data: responseFromService})
} catch (error) {
    return res.status(400).json({success: false, message: error.message})
}}

module.exports.updateProduct = async (req, res) => {
try {
    const responseFromService = await productService.updateProduct(req)
    return res.status(200).json({success: true, data: responseFromService})
} catch (error) {
    return res.status(400).json({success: false, message: error.message})
}}

module.exports.getProductReviews = async (req,res) => {
    try {
        const responseFromService = await productService.getProductReviews(req.params,req.query)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.createProductForSale = async (req,res) => {
    try {
        const responseFromService = await productService.createProductForSale(req.params,req.body)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.deleteProductForSale = async (req,res) => {
    try {
        const responseFromService = await productService.deleteProductForSale(req.params)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}


module.exports.getProductsForSale = async (req,res) => {
    try {
        const responseFromService = await productService.getProductsForSale()
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.updateSaleProduct = async (req,res) => {
    try {
        const responseFromService = await productService.updateSaleProduct(req.params, req.body)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}