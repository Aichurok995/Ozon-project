const {
    ProductModel,
    CategoryModel,
    UserModel,
    sequelize,
    ReviewModel,
} = require('../postgres/dbConnection');
const {
    prepareProductImageUrl,
    deleteProductImage,
    prepareCategoryImageUrl,
} = require('../helpers/file.helper');
const { Op } = require('sequelize');

module.exports.createProduct = async (req) => {
    try {
        const body = req.body;
        const file = req.file;
        const category = await CategoryModel.findByPk(body.categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        const newProduct = await ProductModel.create({
            name: body.name,
            brand: body.brand,
            price: body.price,
            countInStock: body.countInStock,
            image: file.filename,
            categoryId: body.categoryId,
            userId: req.payload.userId,
        });
        const frontResult = {
            name: newProduct.name,
            brand: newProduct.brand,
            price: newProduct.price,
            countInStock: newProduct.countInStock,
            image: prepareProductImageUrl(newProduct.image),
            categoryId: newProduct.categoryId,
            userId: newProduct.userId,
            id: newProduct.id,
        };
        return frontResult;
    } catch (error) {
        throw error;
    }
};

module.exports.getAllProducts = async (query) => {
    try {
        const { page, limit, ...filter } = query;
        const con1 = query.page;
        const con2 = query.limit;
        const offsetCon = (con1 - 1) * con2;
        const products = await ProductModel.findAll({
            where: filter,
            ...(con2 && { limit: con2 }),
            ...(con1 && { offset: offsetCon }),
            include: [
                { model: UserModel, as: 'user' },
                { model: CategoryModel, as: 'category' },
            ],
        });
        products.forEach((product) => {
            ((product.image = prepareProductImageUrl(product.image)),
                (product.category.icon = prepareCategoryImageUrl(
                    product.category.icon,
                )));
        });
        return products;
    } catch (error) {
        throw error;
    }
};

module.exports.getById = async ({ id }) => {
    try {
        const product = await ProductModel.findOne({
            where: { id: id },
            include: [
                { model: UserModel, as: 'user' },
                { model: CategoryModel, as: 'category' },
            ],
        });
        if (!product) {
            throw new Error('Product was not found');
        }
        product.image = prepareProductImageUrl(product.image);
        product.category.icon = prepareCategoryImageUrl(product.category.icon);
        return product;
    } catch (error) {
        throw error;
    }
};

module.exports.deleteProduct = async ({ id }) => {
    try {
        const product = await ProductModel.destroy({ where: { id: id } });
        if (!product) {
            throw new Error('Product was not found');
        }
        await Favorite.destroy({where:{ productId: id }});
        return product;
    } catch (error) {
        throw error;
    }
};

module.exports.updateProduct = async (req) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const file = req.file;
        const userId = req.payload.userId;
        const existedProduct = await ProductModel.findOne({
            where: { id: id },
        });
        if (!existedProduct) {
            throw new Error('Product was not found');
        }
        if (existedProduct.userId.toString() !== userId.toString()) {
            throw new Error('You are not owner of product');
        }
        if (body.categoryId) {
            const category = await CategoryModel.findOne({
                where: { id: body.categoryId },
            });
            if (!category) {
                throw new Error('Category does not exist');
            }
            console.log(category);
        }

        const updatedInfo = {};
        if (file) {
            deleteProductImage(existedProduct.image);
            updatedInfo.image = file.filename;
        }
        const copyOfUpdatedInfo = {
            ...updatedInfo,
            name: body.name,
            brand: body.brand,
            price: body.price,
            countInStock: body.countInStock,
            categoryId: body.categoryId,
        };

        await ProductModel.update(copyOfUpdatedInfo, {
            where: { id: id },
        });
        const product = await ProductModel.findByPk(id);
        if (product.image) {
            product.image = prepareProductImageUrl(product.image);
        }
        return product;
    } catch (error) {
        throw error;
    }
};

module.exports.getProductReviews = async ({ id }, query) => {
    try {
        const { page, limit} = query;
        const product = await ProductModel.findByPk(id, {
            attributes: ['name', 'totalReview', 'avrRate'],
        });

        if (!product) {
            throw new Error('There is no product with given ID');
        }
        const filter = { productId: id };
        const reviews = await ReviewModel.findAll({
            where: filter,
            ...(page && { offset: (page - 1) * limit }),
            ...(limit && { limit: limit }),
        });

        return reviews;
    } catch (error) {
        throw error;
    }
};

module.exports.createProductForSale = async ({ id }, body) => {
    try {
        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('There is no product');
        }
        product.oldPrice = product.price;
        const newPrice =
            product.oldPrice -
            ((product.oldPrice * body.salePercent) / 100).toFixed(2);
        product.price = newPrice;
        product.saleEndDate = body.saleEndDate;
        await product.save();
        product.image = prepareProductImageUrl(product.image);
        const productResult = {
            ...product.toJSON(),
            isOnSale: true,
            salePercent: body.salePercent,
        };
        return productResult;
    } catch (error) {
        throw error;
    }
};

module.exports.deleteProductForSale = async ({ id }) => {
    try {
        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('There is no product');
        }
        if (product.oldPrice === null) {
            return { ...product.toJSON(), isOnSale: false, salePercent: null };
        }
        product.price = product.oldPrice;
        product.oldPrice = null;
        product.saleEndDate = null;
        await product.save();
        const productResult = {
            ...product.toJSON(),
            image: prepareProductImageUrl(product.image),
            isOnSale: false,
            salePercent: null,
        };
        return productResult;
    } catch (error) {
        throw error;
    }
};

module.exports.getProductsForSale = async () => {
    try {
        const saleProducts = await ProductModel.findAll({
            where: {
                oldPrice: {
                    [Op.gt]: sequelize.col('price'),
                },
            },
        });
        if (saleProducts.length === 0) {
            return 'There are no products on sale';
        }
        saleProducts.map(
            (product) =>
                (product.image = prepareProductImageUrl(product.image)),
        );
        const productsWithPercents = saleProducts.map((product) => ({
            ...product.toJSON(),
            salePercent: parseInt(
                ((product.oldPrice - product.price) / product.oldPrice) * 100,
            ),
        }));
        return productsWithPercents;
    } catch (error) {
        throw error;
    }
};

module.exports.updateSaleProduct = async ({ id }, body) => {
    try {
        const product = await ProductModel.findByPk(id);
        if (!product) {
            throw new Error('There is no product');
        }

        const updatedInfo = {};
        if (body.salePercent !== undefined) {
            updatedInfo.price = parseInt(
                product.oldPrice - (product.oldPrice * body.salePercent) / 100,
            );
        }
        updatedInfo.saleEndDate = body.saleEndDate;
        await ProductModel.update(updatedInfo, { where: { id: id } });
        const updatedProduct = await ProductModel.findByPk(id);
        updatedProduct.image = prepareProductImageUrl(updatedProduct.image);
        const productResult = {
            ...updatedProduct.toJSON(),
            isOnSale: true,
            salePercent: body.salePercent
                ? body.salePercent
                : parseInt(
                      ((updatedProduct.oldPrice - updatedProduct.price) /
                          updatedProduct.oldPrice) *
                          100,
                  ),
        };
        return productResult;
    } catch (error) {
        throw error;
    }
};
