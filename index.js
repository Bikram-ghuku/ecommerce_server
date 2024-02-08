const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const server = express()
server.use(cors())
server.use(bodyParser.json())

const userRouter = require('./routes/UserRoutes');
const productRouter = require('./routes/ProductRoutes');
const sellerRouter = require('./routes/SellerRoutes');
const orderRouter = require('./routes/OrderRouter');
const cartRouter = require('./routes/CartRouter');
const addressRouter = require('./routes/AddressRouter');
const paymentRouter = require('./routes/PaymentsRouter');
const metricsRouter = require('./routes/MetricsRoutes')

server.use('/user', userRouter)
server.use('/products', productRouter)
server.use('/seller', sellerRouter)
server.use('/order', orderRouter)
server.use('/cart', cartRouter)
server.use('/address', addressRouter)
server.use('/payment', paymentRouter)
server.use('/', metricsRouter)

server.listen(process.env.PORT || 8080, ()=>{
    console.log(`server started on ${process.env.PORT || 8080}`);
})