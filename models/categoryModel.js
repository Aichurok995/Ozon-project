const {DataTypes} = require('sequelize')

module.exports.createCategoryModel = (sequelize) => {
    const Category = sequelize.define('Category',{
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Category
}
   