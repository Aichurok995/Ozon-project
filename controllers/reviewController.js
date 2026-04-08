const reviewService = require('../service/reviewService.js')

module.exports.createReview = async (req,res) => {
    try {
        const responseFromService = await reviewService.createReview(req.body, req.payload)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.updateReview = async (req,res) => {
    try {
        const responseFromService = await reviewService.updateReview(req.params, req.body )
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.deleteReview = async (req,res) => {
    try {
        const responseFromService = await reviewService.deleteReview(req.params)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}


