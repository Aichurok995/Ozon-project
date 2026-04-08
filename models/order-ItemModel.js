const {DataTypes} = require('sequelize')

module.exports.createOrderItemModel = (sequelize) => {
    const OrderItem = sequelize.define('OrderItem',{
        orderId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        totalPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    })
    return OrderItem
}