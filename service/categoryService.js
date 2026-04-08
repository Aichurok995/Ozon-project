const { CategoryModel, ProductModel } = require('../postgres/dbConnection.js');
const {
    prepareCategoryImageUrl,
    deleteCategoryImage,
    prepareProductImageUrl,
} = require('../helpers/file.helper.js');

module.exports.createCategory = async (req) => {
    try {
        const existedCategory = await CategoryModel.findOne({
            where: { name: req.body.name },
        });
        if (existedCategory) {
            throw new Error('Category already exists');
        }
        const newCategory = await CategoryModel.create({
            name: req.body.name,
            icon: req.file.filename,
        });
        const urlResult = {
            name: newCategory.name,
            icon: prepareCategoryImageUrl(newCategory.icon),
            id: newCategory.id,
        };
        return urlResult;
    } catch (error) {
        throw error;
    }
};

module.exports.getAllCategory = async () => {
    try {
        const categoryList = await CategoryModel.findAll();
        const result = categoryList.map((category) => {
            return {
                name: category.name,
                icon: prepareCategoryImageUrl(category.icon),
                id: category.id,
            };
        });
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports.getById = async ({ id }) => {
    try {
        const category = await CategoryModel.findOne({ where: { id: id } });
        if (!category) {
            throw new Error('The category with given ID was not found');
        }
        const products = await ProductModel.findAll({
            where: { categoryId: id },
        });
        const newProducts = products.map((product) => ({
            ...product.toJSON(),
            image: prepareProductImageUrl(product.image),
        }));
        const result = {
            name: category.name,
            icon: prepareCategoryImageUrl(category.icon),
            id: category.id,
            newProducts,
        };
        return result;
    } catch (error) {
        throw error;
    }
};

module.exports.updateCategoryService = async (req) => {
    try {
        const category = await CategoryModel.findOne({
            where: { id: req.params.id },
        });
        if (!category) {
            throw new Error('Category not found');
        }
        const updateData = {};
        if (req.file) {
            (deleteCategoryImage(category.icon),
                (updateData.icon = req.file.filename));
        }
        updateData.name = req.body.name;

        await CategoryModel.update(updateData, {
            where: { id: req.params.id },
        });
        const updatedCategory = await CategoryModel.findByPk(req.params.id);
        const urlResult = {
            name: updatedCategory.name,
            icon: prepareCategoryImageUrl(updatedCategory.icon),
            id: updatedCategory.id,
        };
        return urlResult;
    } catch (error) {
        throw error;
    }
};

module.exports.deleteCategory = async ({ id }) => {
    try {
        const category = await CategoryModel.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        deleteCategoryImage(category.icon);
        const deletedCategory = await CategoryModel.destroy({
            where: { id: id },
        });
        return { deletedCategory };
    } catch (error) {
        throw error;
    }
};
