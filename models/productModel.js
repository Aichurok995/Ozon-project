const { DataTypes } = require('sequelize');

module.exports.createProductModel = (sequelize) => {
    const Product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        brand: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        oldPrice: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        saleEndDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        countInStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            min: 0,
            max: 255,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalReview: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        avrRate: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
            min: 0,
            max: 5,
        },
    });
    return Product;
};
