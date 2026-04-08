const express = require('express');
const app = express();
require('dotenv/config');
const cors = require('cors');
const morgan = require('morgan');
const { connection } = require('./postgres/dbConnection.js');


//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use('/public/', express.static(__dirname + '/public/')) 

//routes
app.use('/api/v1/users', require ('./routes/userRoutes.js'))
app.use('/api/v1/categories', require ('./routes/categoryRoutes.js'))
app.use('/api/v1/products', require ('./routes/productRoutes.js'))
app.use('/api/v1/orders', require ('./routes/orderRoutes.js'))
app.use('/api/v1/reviews', require ('./routes/reviewRoutes.js'))
app.use('/api/v1/favorites', require ('./routes/favoriteRoutes.js'))


connection()


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log('Server is listening on port 4000');
});
