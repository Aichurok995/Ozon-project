const {
    UserModel,
    ProductModel,
    ReviewModel,
} = require('../postgres/dbConnection.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { prepareProductImageUrl } = require('../helpers/file.helper.js');

module.exports.register = async (serviceData) => {
    try {
        const user = await UserModel.findOne({
            where: { email: serviceData.email },
        });
        if (user) {
            throw new Error('User already exists with given email');
        }
        const hashedPassword = await bcrypt.hash(serviceData.password, 12);
        const newUser = await UserModel.create({
            name: serviceData.name,
            email: serviceData.email,
            password: hashedPassword,
            phone: serviceData.phone,
            role: serviceData.role,
            street: serviceData.street,
            apartment: serviceData.apartment,
            city: serviceData.city,
        });

        const token = jwt.sign(
            { id: newUser.id, role: newUser.role },
            process.env.SECRET_KEY,
            {
                expiresIn: '1 week',
            },
        );
        const data = newUser.toJSON();
        delete data.password;
        return { data, token };
    } catch (error) {
        console.log('Something went wrong:Service:register', error);
        throw error;
    }
};

module.exports.login = async ({ email, password }) => {
    try {
        const foundUser = await UserModel.findOne({ where: { email: email } });
        if (!foundUser) {
            throw new Error('User cannot be found');
        }
        const isValid = await bcrypt.compare(password, foundUser.password);
        if (!isValid) {
            throw new Error('Invalid password');
        }
        const token = jwt.sign(
            { id: foundUser.id, role: foundUser.role },
            process.env.SECRET_KEY,
            {
                expiresIn: '1 week',
            },
        );
        return { token: token };
    } catch (error) {
        console.log('Something went wrong:Service:login', error);
        throw error;
    }
};

module.exports.getAllUsers = async (query) => {
    try {
        const { page, limit, ...filter } = query;
        const con1 = parseInt(query.page);
        const con2 = parseInt(query.limit);
        const offsetCon = (con1 - 1) * con2;
        const users = await UserModel.findAll({
            where: filter,
            limit: con2,
            offset: offsetCon,
        });
        return users;
    } catch (error) {
        console.log('Something went wrong:Service:getAllUsers', error);
        throw error;
    }
};

module.exports.getById = async ({ id }) => {
    try {
        const user = await UserModel.findOne({ where: { id: id } });
        if (!user) {
            throw new Error('User not found');
        }
        const products = await ProductModel.findAll({ where: { userId: id } });
        const newProducts = products.map((product) => ({
            ...product.toJSON(),
            image: prepareProductImageUrl(product.image),
        }));
        const userObj = user.toJSON();
        userObj.products = newProducts;
        return userObj;
    } catch (error) {
        console.log('Something went wrong:Service:getUserById', error);
        throw error;
    }
};

module.exports.deleteUser = async ({ id }) => {
    try {
        const user = await UserModel.findOne({ where: { id: id } });
        if (!user) {
            throw new Error('User not found');
        }
        const deletedUser = await UserModel.destroy({ where: { id: id } });
        return deletedUser;
    } catch (error) {
        console.log('Something went wrong:Service:deleteUserbyId', error);
        throw error;
    }
};

module.exports.updateUser = async ({ id }, {userId},body) => {
    try {
        const user = await UserModel.findOne({ where: { id: id } });
        if (!user) {
            throw new Error('User not found');
        }
        if (body.email) {
            const existedUserWithGivenEmail = await UserModel.findOne({
                where: { email: body.email },
            });
            if (existedUserWithGivenEmail) {
                throw new Error('Email already exists');
            }
        }
        const updatedUser = await UserModel.update(
            {
                name: body.name,
                email: body.email,
                password: body.password,
                phone: body.phone,
                role: body.role,
                street: body.street,
                apartment: body.apartment,
                city: body.city,
            },
            { where: { id: id } },
        );
        return updatedUser;
    } catch (error) {
        console.log('Something went wrong:Service:updateUserbyId', error);
        throw error;
    }
};

module.exports.getUserReviews = async ({ id }, query) => {
    try {
        const { page, limit, sortBy, order } = query;
        
        const user = await UserModel.findByPk(id);
        if (!user) {
            throw new Error('There is no user with this ID');
        }
       
        const sort = order === 'asc' ? 'ASC' : 'DESC';
        const reviews = await ReviewModel.findAll({
            where: { userId: id },
            ...(limit && { limit: limit }),
            ...(page && { offset: (page - 1) * limit }),
            ...(order&& {order: [[sortBy, sort]]}),
        });
        return reviews;
    } catch (error) {
        throw error;
    }
};
