const fs = require('fs/promises');
const path = require('path');

module.exports.prepareCategoryImageUrl = (icon) => {
    return `${process.env.BASE_PATH}/public/categoryUploads/${icon}`;
};

module.exports.deleteCategoryImage = (icon) => {
    const imagePath = path.join(__dirname, '..', `public/categoryUploads/${icon}`);
    fs.unlink(imagePath)
        .then(() => console.log('Old Image deleted'))
        .catch((error) => console.log('Error with deleting', error));
};

module.exports.prepareProductImageUrl = (image) => {
    return `${process.env.BASE_PATH}/public/productUploads/${image}`;
};

module.exports.deleteProductImage = (image) => {
    const imagePath = path.join(__dirname, '..', `public/productUploads/${image}`);
    fs.unlink(imagePath)
        .then(() => console.log('Old Image deleted'))
        .catch((error) => console.log('Error with deleting', error));
};