const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const stripe = require('stripe')(process.env.STRIPE_SK_KEY);
const server = express()
server.use(cors())
server.use(bodyParser.json())

const userRouter = require('./routes/UserRoutes');
const productRouter = require('./routes/ProductRoutes');
const sellerRouter = require('./routes/SellerRoutes');
const orderRouter = require('./routes/OrderRouter');
const cartRouter = require('./routes/CartRouter');

server.use('/user', userRouter)
server.use('/products', productRouter)
server.use('/seller', sellerRouter)
server.use('/order', orderRouter)
server.use('/cart', cartRouter)

server.post('/addAddress', async (req, res)=>{
    let address = new Address();
    address.uid = req.body.uid
    address.address = req.body.address
    address.pin = req.body.pincode
    address.city = req.body.city
    address.state = req.body.state
    address.country = req.body.country
    address.phone = req.body.phone
    res.send({code: 'ok'})
    const user = await User.find({_id: req.body.uid})
    var addressAr = user[0].address
    addressAr.push(address._id)
    address.save()
    await User.updateOne({_id : req.body.uid}, {address: addressAr})
})

server.post('/getAddress', async (req, res)=>{
    const doc = await Address.find({uid: req.body.uid})
    res.send(doc)
})

server.get('/stripeConfig', async (req, res)=>{
    res.send({key: process.env.STRIPE_PU_KEY})
})

server.post('/createPaymentIntent', async (req, res)=>{
    const user = await User.find({_id: req.body.uid})
    var items = {};
    var amount = 0;
    var cartDet = user[0].cart
    for(var i=0; i<cartDet.length; i++){
        var currId = cartDet[i]._id
        if(items[currId]){
            items[currId] += 1
        }
        else{
            items[currId] = 1
        }
    }

    for(var key in items){
        const item = await Items.find({_id: key})
        amount += item[0].cost*items[key]
    }
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 100*100,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.send({clientSecret: paymentIntent.client_secret})
    }catch(e){
        console.log(e)
    }
})

server.post('/getBill', async (req, res)=>{
    const odet = await Order.find({_id: req.body.oid});
    const pData = await Items.find({_id: odet[0].pid});
    const addData = await Address.find({_id: odet[0].address});
    const seller = await Seller.find({id: odet[0].sid})
    const buy = await User.find({_id: odet[0].uid})
    var data = {}
    data._id = odet[0]._id
    data.qty = odet[0].qty
    data.status = odet[0].status
    data.pdtName = pData[0].pdtName
    data.desc = pData[0].desc
    data.address = addData[0].address
    data.pin = addData[0].pin
    data.city = addData[0].city
    data.state = addData[0].state
    data.country = addData[0].country
    data.phone = addData[0].phone
    data.price = pData[0].cost
    data.sellerName = seller[0].name
    data.buyerName = buy[0].name
    data.paymentId = odet[0].paymentIntent
    res.send(data)
})

server.listen(process.env.PORT, ()=>{
    console.log(`server started on ${process.env.PORT}`);
})