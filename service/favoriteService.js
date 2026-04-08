const {FavoriteModel, ProductModel, UserModel} = require('../postgres/dbConnection')

module.exports.createFavorite = async (body, payload) => {
    try {
        const product = await ProductModel.findOne({where: {id: body.productId}});
        if (!product) {
            throw new Error('No product with given Id');
        }

        const existedFavorite = await FavoriteModel.findOne({where:{
            productId: body.productId,
            userId: payload.userId,
        }});
        if (existedFavorite) {
            throw new Error('Product is already in Favorites');
        }
        const favorite = await FavoriteModel.create({
            productId: body.productId,
            userId: payload.userId,
        });
        
        return favorite;
    } catch (error) {
        throw error;
    }
};

module.exports.deleteProductFromFavorite = async ({ id }, payload) => {
    try {
        const existedFavorite = await FavoriteModel.findOne({where:{
            productId: id,
            userId: payload.userId,
        }});
        if (!existedFavorite) {
            throw new Error('No product with given Id or you are not owner');
        }
        const deletedProduct = await FavoriteModel.destroy({where:{
            productId: id,
            userId: payload.userId,
        }}
    );
        return deletedProduct;
    } catch (error) {
        throw error;
    }
};

module.exports.getFavoriteProducts = async (query, payload) => {
    try {
        const { page, limit } = query;
        const { userId } = payload;
        const products = await FavoriteModel.findAll({where:{ userId: userId },
            ...(limit && { limit: limit }),
            ...(page && { offset: (page-1)*limit}),
            include: [
                { model: ProductModel, as: 'product' }
            ],
        })
        return products;
    } catch (error) {
        throw error;
    }
};


module.exports.checkFavoriteProduct = async ({id}, {userId}) => {
    try {
        const favoriteProduct = await FavoriteModel.findAll({where:{productId:id, userId:userId }})
            return {"isFavorite": favoriteProduct.length > 0}
        }
     catch (error) {
        throw error
    }
}