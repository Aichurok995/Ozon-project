const {DataTypes} = require('sequelize')

module.exports.createFavoriteModel = (sequelize) => {
    const Favorite = sequelize.define('Favorite',{
        productId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Favorite
}