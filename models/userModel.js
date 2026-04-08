const {DataTypes} = require('sequelize')

module.exports.createUserModel = (sequelize) => {
    const User = sequelize.define('User',{
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            isLowercase: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'seller', 'customer'),
            allowNull: false
        },
        street: {
            type: DataTypes.STRING,
            allowNull: true
        },
        apartment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    return User
}
   
   