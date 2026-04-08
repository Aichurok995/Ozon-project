const { Sequelize } = require('sequelize');
const { ReviewModel, ProductModel } = require('../postgres/dbConnection');

module.exports.createReview = async (body, payload) => {
    try {
        const product = await ProductModel.findByPk(body.productId);
        if (!product) {
            throw new Error('No product with given Id');
        }

        const existedReview = await ReviewModel.findOne({
            where: {
                productId: body.productId,
                userId: payload.userId,
            },
        });

        if (existedReview) {
            return existedReview;
        }
        const review = await ReviewModel.create({
            productId: body.productId,
            userId: payload.userId,
            rating: body.rating,
            comment: body.comment,
        });
        const [updatedProduct] = await ProductModel.increment('totalReview', {
            by: 1,
            where: { id: body.productId },
        });
        let ratingStats = 0;
        const productReviews = await ReviewModel.findAll({
            where: { productId: body.productId },
        });
        productReviews.forEach((review) => {
            ratingStats += review.rating;
        });
        const averageRating =
            productReviews.length > 0
                ? ratingStats / updatedProduct[0][0].totalReview
                : 0;

        await ProductModel.update(
            { avrRate: averageRating },
            { where: { id: body.productId } },
        );
        return review;
    } catch (error) {
        throw error;
    }
};

module.exports.updateReview = async ({ id }, body) => {
    try {
        const review = await ReviewModel.findByPk(id);
        if (!review) {
            throw new Error('There is no review with this ID');
        }
        const [, updatedReview] = await ReviewModel.update(
            {
                productId: body.productId,
                rating: body.rating,
                comment: body.comment,
            },
            { where: { id: id }, returning: true },
        );
        let ratingStats = 0;
        const product = await ProductModel.findOne({
            where: { id: body.productId },
        });
        const productReviews = await ReviewModel.findAll({
            where: { productId: body.productId },
        });
        productReviews.forEach((review) => {
            ratingStats += review.rating;
        });
        const averageRating =
            productReviews.length > 0 ? ratingStats / product.totalReview : 0;
        await ProductModel.update(
            { avrRate: averageRating },
            { where: { id: body.productId } },
        );
        return updatedReview[0];
    } catch (error) {
        throw error;
    }
};

module.exports.deleteReview = async ({ id }) => {
    try {
        const review = await ReviewModel.findByPk(id);
        if (!review) {
            throw new Error('Review was not deleted');
        }

        const reviewProduct = review.productId;
        await ReviewModel.destroy({ where: { id: id } });
        const stats = await ReviewModel.findAll({
            where: { productId: reviewProduct },
            attributes: [
                'productId',
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'reviewsCount'],
            ],
            group: ['productId'],
            raw: true,
        });
        if (stats.length > 0) {
            await ProductModel.update(
                {
                    avrRate: stats[0].avgRating,
                    totalReview: stats[0].reviewsCount,
                },
                { where: { id: reviewProduct } },
            );
        } else {
            await ProductModel.update(
                {
                    avrRate: 0,
                    totalReview: 0,
                },
                { where: { id: reviewProduct } },
            );
        }
        return review;
    } catch (error) {
        throw error;
    }
};
