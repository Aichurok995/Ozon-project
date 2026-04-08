const multer = require('multer')
const path = require('path')

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const createStorage = (folderName) => 
    multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]// квадратные скобки потому что идет извлечение из переменной, который содержит ключ, который содержит символы
        let uploadError = new Error('Invalid image type')
        if(isValid) {
            uploadError = null
        }
        cb(uploadError, `public/${folderName}`)
    }, 
    filename: function(req, file, cb) {
        // const fileName = file.originalname.split(' ').join('-')
        const fileName = path.parse(file.originalname).name
        const extension = FILE_TYPE_MAP[file.mimetype]
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})

const categoryUpload = multer({storage: createStorage('categoryUploads')})
const productUpload = multer({storage: createStorage('productUploads')})

module.exports = {categoryUpload, productUpload}



