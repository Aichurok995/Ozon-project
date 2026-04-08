const { Sequelize } = require('sequelize');
const {
    OrderModel,
    OrderItemModel,
    ProductModel,
} = require('../postgres/dbConnection');

module.exports.createOrder = async ({ body, payload }) => {
    try {
        const products = body.products;
        const productIds = products.map((product) => product.product);
        const productsDb = await ProductModel.findAll({
            where: { id: productIds },
        });
        if (products.length !== productsDb.length) {
            const foundIds = productsDb.map((product) => product.id.toString());
            const missing = productIds.filter(
                (id) => !id.toString().includes(foundIds),
            );
            const error = new Error('Some products not found');
            error.missingProducts = missing;
            throw error;
        }
        productsDb.forEach((item) => {
            const filteredProduct = products.find(
                (p) => p.product.toString() === item.id.toString(),
            );
            if (filteredProduct.quantity > item.countInStock) {
                throw new Error(`There is no enough product`);
            }
        });

        const order = await OrderModel.create({
            address: body.address,
            phone: body.phone,
            customerId: payload.userId,
        });

        let orderTotalPrice = 0;
        for (const product of productsDb) {
            const filteredProduct = products.find(
                (p) => p.product.toString() === product.id.toString(),
            );
            const orderItem = await OrderItemModel.create({
                orderId: order.id,
                productId: product.id,
                quantity: filteredProduct.quantity,
                totalPrice: product.price * filteredProduct.quantity,
            });
            orderTotalPrice += orderItem.totalPrice;
        }
        order.totalPrice = orderTotalPrice;
        const response = await order.save();
        const orderItem = await OrderItemModel.findAll({
            where: { orderId: order.id },
            include: [{ model: ProductModel, as: 'product' }],
        });

        for (const item of products) {
            await ProductModel.decrement('countInStock', {
                by: item.quantity,
                where: { id: item.product },
            });
        }
        const responseObj = response.toJSON();
        responseObj.orderItems = orderItem;
        return responseObj;
    } catch (error) {
        throw error;
    }
};

module.exports.getAllOrder = async (payload) => {
    try {
        const orders = await OrderModel.findAll({
            where: { customerId: payload.userId },
            include: [
                {
                    model: OrderItemModel,
                    as: 'orderItems',
                    include: [
                        {
                            model: ProductModel,
                            as: 'product',
                        },
                    ],
                },
            ],
        });
        return orders;
    } catch (error) {
        throw error;
    }
};

module.exports.getById = async ({ id }, payload) => {
    try {
        const order = await OrderModel.findByPk(id);
        if (!order) {
            throw new Error('Order was not found');
        }
        if (payload.userId.toString() !== order.customerId.toString()) {
            throw Error('You are not owner of order');
        }
        const order2 = await OrderModel.findByPk(id, {
            include: [
                {
                    model: OrderItemModel,
                    as: 'orderItems',
                    include: [
                        {
                            model: ProductModel,
                            as: 'product',
                        },
                    ],
                },
            ],
        });
        return order2;
    } catch (error) {
        throw error;
    }
};

module.exports.updateOrder = async ({ id }, body, payload) => {
    try {
        const existedOrder = await OrderModel.findByPk(id);
        if (!existedOrder) {
            throw new Error('No Order with given ID ');
        }
        if (existedOrder.customerId.toString() !== payload.userId.toString()) {
            throw new Error('You are not owner of order');
        }

        const [, newOrder] = await OrderModel.update(
            {
                address: body.address,
                phone: body.phone,
            },
            { where: { id: id }, returning: true },
        );

        if (body.products) {
            const products = body.products;
            const productIds = products.map((product) => product.product);
            const productsDb = await ProductModel.findAll({
                where: { id: productIds },
            });

            if (products.length !== productsDb.length) {
                const foundIds = productsDb.map((product) =>
                    product.id.toString(),
                );
                const missing = productIds.filter(
                    (id) => !foundIds.includes(id.toString()),
                );
                const error = new Error('Some products not found');
                error.missingProducts = missing;
                throw error;
            }

            productsDb.forEach((item) => {
                const filteredProduct = products.find(
                    (p) => p.product.toString() === item.id.toString(),
                );
                if (filteredProduct.quantity > item.countInStock) {
                    throw new Error(`There is no enough product`);
                }
            });

            const orderItemDbs = await OrderItemModel.findAll({
                where: { orderId: id },
            });

            for (const product of products) {
                const sortedProducts = orderItemDbs.find(
                    (item) =>
                        item.productId.toString() ===
                        product.product.toString(),
                );

                if (!sortedProducts) {
                    throw new Error(
                        `Product ${product.product} not found in order`,
                    );
                }
                if (product.quantity > sortedProducts.quantity) {
                    const diff = product.quantity - sortedProducts.quantity;
                    await ProductModel.decrement('countInStock', {
                        by: diff,
                        where: { id: sortedProducts.productId },
                    });
                }

                if (product.quantity < sortedProducts.quantity) {
                    const diff = sortedProducts.quantity - product.quantity;
                    await ProductModel.increment('countInStock', {
                        by: diff,
                        where: { id: sortedProducts.productId },
                    });
                }
            }
            let orderTotalPrice = 0;
            for (const product of productsDb) {
                const filteredProduct = products.find(
                    (p) => p.product.toString() === product.id.toString(),
                );

                const [, rows] = await OrderItemModel.update(
                    {
                        quantity: filteredProduct.quantity,
                        totalPrice: product.price * filteredProduct.quantity,
                    },
                    {
                        where: {
                            orderId: id,
                            productId: filteredProduct.product,
                        },
                        returning: true,
                    },
                );

                orderTotalPrice += rows[0].totalPrice;
            }

            newOrder[0].totalPrice = orderTotalPrice;
            await newOrder[0].save();
        }

        const orderItems = await OrderItemModel.findAll({
            where: {
                orderId: newOrder[0].id,
            },
            include: [{ model: ProductModel, as: 'product' }],
        });

        const responseObj = newOrder[0].toJSON();
        responseObj.orderItems = orderItems;
        return responseObj;
    } catch (error) {
        throw error;
    }
};

module.exports.deleteOrder = async ({ id }, payload) => {
    try {
        const order = await OrderModel.findByPk(id);
        if (!order) {
            throw Error('Order was not found');
        }
        if (payload.userId.toString() !== order.customerId.toString()) {
            throw Error('You are not owner of order');
        }
        const orderItem = await OrderItemModel.findAll({where: { orderId: order.id }});

        for (const item of orderItem) {
            await ProductModel.increment('countInStock', {
                by: item.quantity,
                where: { id: item.productId },
            });
        }
        await OrderItemModel.destroy({where:{ orderId: order.id }});

        const deletedOrder = await OrderModel.destroy({where: {id: id}});
        return deletedOrder;
    } catch (error) {
        throw error;
    }
};


module.exports.getTotalSales = async() => {
    try {
        const data = await OrderModel.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('totalPrice')), 'total']
            ],
            raw: true
        })
        return data
    } catch (error) {
        throw error
    }
}