const { Sequelize } = require('sequelize');
const { createUserModel } = require('../models/userModel');
const { createCategoryModel } = require('../models/categoryModel');
const { createProductModel } = require('../models/productModel');
const { createOrderModel } = require('../models/orderModel');
const { createOrderItemModel } = require('../models/order-ItemModel');
const { createReviewModel } = require('../models/reviewModel');
const {createFavoriteModel} = require('../models/favoriteModel')

const sequelize = new Sequelize('OZON', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
});

const UserModel = createUserModel(sequelize);
const CategoryModel = createCategoryModel(sequelize);
const ProductModel = createProductModel(sequelize);
const OrderModel = createOrderModel(sequelize);
const OrderItemModel = createOrderItemModel(sequelize);
const ReviewModel = createReviewModel(sequelize);
const FavoriteModel = createFavoriteModel(sequelize)

CategoryModel.hasMany(ProductModel, {
    foreignKey: 'categoryId',
    as: 'products',
});

ProductModel.belongsTo(CategoryModel, {
    foreignKey: 'categoryId',
    as: 'category',
});

UserModel.hasMany(ProductModel, {
    foreignKey: 'userId',
    as: 'products',
});

ProductModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
});

UserModel.hasMany(OrderModel, {
    foreignKey: 'customerId',
    as: 'orders',
});

OrderModel.belongsTo(UserModel, {
    foreignKey: 'customerId',
    as: 'user',
});

OrderModel.hasMany(OrderItemModel, {
    foreignKey: 'orderId',
    as: 'orderItems',
});

OrderItemModel.belongsTo(OrderModel, {
    foreignKey: 'orderId',
    as: 'order',
});

ProductModel.hasMany(OrderItemModel, {
    foreignKey: 'productId',
    as: 'orderItems',
});

OrderItemModel.belongsTo(ProductModel, {
    foreignKey: 'productId',
    as: 'product',
});

ProductModel.hasMany(ReviewModel, {
    foreignKey: 'productId',
    as: 'reviews',
});

ReviewModel.belongsTo(ProductModel, {
    foreignKey: 'productId',
    as: 'product',
});

UserModel.hasMany(ReviewModel, {
    foreignKey: 'userId',
    as: 'reviews',
});

ReviewModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
});

ProductModel.hasMany(FavoriteModel, {
    foreignKey: 'productId',
    as: 'favorites',
});

FavoriteModel.belongsTo(ProductModel, {
    foreignKey: 'productId',
    as: 'product',
});

UserModel.hasMany(FavoriteModel, {
    foreignKey: 'userId',
    as: 'favorites',
});

FavoriteModel.belongsTo(UserModel, {
    foreignKey: 'userId',
    as: 'user',
});


const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ alter: true });
        console.log('Database synced');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = {
    connection,
    sequelize,
    UserModel,
    CategoryModel,
    ProductModel,
    OrderModel,
    OrderItemModel,
    ReviewModel,
    FavoriteModel
};
