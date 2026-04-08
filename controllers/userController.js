const userService = require('../service/userService.js')

module.exports.register = async (req,res) => {
    try {
       const responseFromService = await userService.register(req.body)
       return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.login = async (req,res) => {
    try {
       const responseFromService = await userService.login(req.body)
       return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.getAllUsers = async (req,res) => {
    try {
       const responseFromService = await userService.getAllUsers(req.query)
       return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.getById = async(req, res) => {
    try {
        const responseFromService = await userService.getById(req.params)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.deleteUser = async(req, res) => {
    try {
        const responseFromService = await userService.deleteUser(req.params)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.updateUser = async(req, res) => {
    try {
        const responseFromService = await userService.updateUser(req.params,req.payload,req.body)
        return res.status(200).json({success: true, data: responseFromService})
    } catch (error) {
        return res.status(400).json({success: false, message: error.message})
    }
}

module.exports.getUserReviews = async(req, res) => {
    try {
        const responseFromService = await userService.getUserReviews(req.params, req.query)
        return res.status(200).send(responseFromService);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

