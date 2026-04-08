const orderService = require('../service/orderService.js')

module.exports.createOrder = async (req,res) => {
    try {
        const responseFromService = await orderService.createOrder(req)
        return res.status(200).json({success: true, data:responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message:error.message, missingProducts: error.missingProducts})
    }
}

module.exports.getAllOrder = async (req,res) => {
    try {
        const responseFromService = await orderService.getAllOrder(req.payload)
        return res.status(200).json({succes: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.getById = async (req, res) => {
    try {
        const responseFromService = await orderService.getById(req.params, req.payload)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message, missingProducts: error.missingProducts})
    }
}

module.exports.updateOrder = async (req, res) => {
    try {
        const responseFromService = await orderService.updateOrder(req.params, req.body, req.payload)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.deleteOrder = async (req, res) => {
    try {
        const responseFromService = await orderService.deleteOrder(req.params, req.payload)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.getTotalSales= async (req, res) => {
    try {
        const responseFromService = await orderService.getTotalSales()
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}