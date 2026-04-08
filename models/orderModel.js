const {DataTypes, ENUM} = require('sequelize')
const { toDefaultValue } = require('sequelize/lib/utils')

module.exports.createOrderModel = (sequelize) => {
    const Order = sequelize.define('Order',{
        address:{
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'failed'),
            defaultValue: 'pending',
        },
        totalPrice: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        dateOrdered: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    })
    return Order
}