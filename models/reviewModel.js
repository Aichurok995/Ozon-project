const {DataTypes} = require('sequelize')

module.exports.createReviewModel = (sequelize) => {
    const Review = sequelize.define('Review',{
        productId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            min:1,
            max:5,
            allowNull: false
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })
    return Review
}