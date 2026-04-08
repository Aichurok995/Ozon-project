const categoryService = require ('../service/categoryService.js')

module.exports.createCategory = async (req,res) => {
    try {
        const responseFromService = await categoryService.createCategory(req)
        console.log('ulan')
        return res.status(200).send(responseFromService);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

module.exports.getAllCategory = async (req,res) => {
    try {
        const responseFromService = await categoryService.getAllCategory()
        return res.status(200).send(responseFromService);
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

module.exports.getById = async (req,res) => {
    try {
        const responseFromService = await categoryService.getById(req.params)
        return res.status(200).send(responseFromService)
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

module.exports.updateCategory = async(req, res) => {
    try {
        const responseFromService = await categoryService.updateCategoryService(req)
        return res.status(200).send(responseFromService)
    } catch (error) {
        return res.status(400).send(error.message)
    }
}

module.exports.deleteCategory = async(req, res) => {
    try {
        const response = await categoryService.deleteCategory(req.params)
        return res.status(200).send({message:'Category is deleted',response})
    } catch (error) {
        return res.status(400).send(error.message)
    }
}
