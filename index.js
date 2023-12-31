const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SK_KEY);
const server = express()
server.use(cors())
server.use(bodyParser.json())
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DataBase Connected!'));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: Array,
    type: String,
    address: Array,
    allow: Boolean
});

const User = mongoose.model('User', userSchema)

const itemsSchema = new mongoose.Schema({
    pdtName: String,
    img: String,
    desc: String,
    cost: Number,
    opts: Array,
    dispType: String,
    seller: String,
    rating: Number
})

const Items = mongoose.model('items', itemsSchema);

const sellerSchema = new mongoose.Schema({
    name: String,
    id: String,
    totSales: Number,
    totOrders: Number
})

const Seller = mongoose.model('sellers', sellerSchema);

const orderSchema = new mongoose.Schema({
    uid: String,
    pid: String,
    sid: String,
    qty: Number,
    status: String,
    address: String,
    paymentIntent: String
})

const Order = mongoose.model('orders', orderSchema);

const addressSchema = new mongoose.Schema({
    uid: String,
    address: String,
    pin: String,
    city: String,
    state: String,
    country: String,
    phone: String
})

const Address = mongoose.model('address', addressSchema);

server.post('/register', async (req, res)=>{
    const doc = await User.find({email: req.body.email})
    if(!doc[0]){
        let user = new User();
        user.name = req.body.name
        user.email = req.body.email
        user.password = req.body.pswd
        user.cart = []
        user.type = req.body.type
        user.address = []
        user.allow = true
        user.save()
        if(req.body.type == "Seller"){
            let seller = new Seller();
            seller.name = req.body.name
            seller.id = user._id
            seller.totSales = 0
            seller.totOrders = 0
            seller.save()
        }
        res.send({code: 'ok'})
    }
    else{
        res.send({code: 'Account Already Present! Use a different account'})
    }
})

server.post('/login', async (req, res)=>{
    const doc = await User.find({email: req.body.email, password: req.body.pswd})
    var resData = doc[0]
    if(resData){
        if(!resData.allow){
            res.send({code: 'Account blocked by admin, please contact admin for more details'})
        }else{
            res.send({name:resData.name, email:resData.email, code:'ok', type: resData.type, id: resData._id})
        }
    }
    else{
        res.send({code:'incorrect username or password'})
    }
})

server.get('/items', async (req, res)=>{
    const data = await Items.find({dispType :{$not: {$eq: "private"}}})
    res.send(JSON.stringify(data));
})

server.post('/cartItems', async (req, res)=>{
    const doc = await User.find({_id: req.body.id})
    if(doc[0]){
        res.send(doc[0].cart)
    }
})

server.post('/addCartItems', async(req, res) => {
    const doc = await User.find({_id: req.body.uid})
    var cartDet = doc[0].cart
    const itemDoc = await Items.find({_id: req.body.pid});
    if(req.body.uid != itemDoc[0].seller){
        cartDet.push(itemDoc[0])
        await User.updateOne({_id : req.body.uid}, {cart: cartDet})
        res.send({code: 'ok'})
    }else{
        res.send({code: 'You cannot add your own product to cart'})
    }
    
})

server.get('/seller', async (req, res)=>{
    const data = await Seller.find({});
    const dict = {}
    for(let i=0; i<data.length; i++){
        dict[data[i].id] = data[i].name
    }
    res.send(JSON.stringify(dict));
})

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

server.post('/removeCart', async (req, res)=>{
    const doc = await User.find({_id: req.body.uid})
    var cartDet = doc[0].cart
    var newCart = []
    var flag = false
    for(let i=0; i<cartDet.length; i++){
        if(!flag){
            if(cartDet[i]._id != req.body.pid){
                newCart.push(cartDet[i])
            }
            else{
                flag = true
            }
        }
        else{
            newCart.push(cartDet[i])
        }
    }
    await User.updateOne({_id : req.body.uid}, {cart: newCart})
    res.send({code: 'ok'})
})

server.post('/getProducts', async (req, res)=>{
    const data = await Items.find({seller: req.body.sid})
    res.send(JSON.stringify(data));
})

server.post('/addOrder', async (req, res)=>{
    const user = await User.find({_id: req.body.uid})
    var items = {};
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
    var oderIds = []
    for(var key in items){
        let order = new Order();
        const item = await Items.find({_id: key})
        const seller = await Seller.find({id: item[0].seller})
        seller[0].totSales += item[0].cost*items[key]
        seller[0].totOrders += 1
        await Seller.updateOne({id: item[0].seller}, {totSales: seller[0].totSales, totOrders: seller[0].totOrders})
        order.sid = item[0].seller
        order.uid = req.body.uid
        order.pid = key
        order.qty = items[key]
        order.status = "Pending"
        order.address = req.body.address
        order.paymentIntent = req.body.paymentIntent
        order.save()
        oderIds.push(order._id)
    }
    await User.updateOne({_id : req.body.uid}, {cart: []})
    res.send({code: 'ok', order: oderIds})
})

server.post('/getOrders', async (req, res)=>{
    const OrData = await Order.find({sid: req.body.uid})
    var dict = []
    for(var i=0; i<OrData.length; i++){
        const pData = await Items.find({_id: OrData[i].pid})
        const uData = await User.find({_id: OrData[i].uid})
        const addData = await Address.find({_id: OrData[i].address})
        var data = {}
        data._id = OrData[i]._id
        data.qty = OrData[i].qty
        data.status = OrData[i].status
        data.pdtName = pData[0].pdtName
        data.user = uData[0].name
        data.address = addData[0].address
        data.paymentId = OrData[i].paymentIntent
        dict.push(data)
    }
    
    res.send(JSON.stringify(dict));
})

server.post('/addProduct', async (req, res)=>{
    let item = new Items();
    item.pdtName = req.body.pdtName
    item.img = req.body.img
    item.desc = req.body.desc
    item.cost = req.body.cost
    item.opts = []
    item.rating = 0
    item.dispType = req.body.dispType
    item.seller = req.body.uid
    item.save()
    res.send({code: 'ok'})
})

server.post('/delProduct', async (req, res)=>{
    await Items.deleteOne({_id: req.body.pid})
    res.send({code: 'ok'})
})

server.post('/myOrders', async (req, res)=>{
    const orData = await Order.find({uid: req.body.uid})
    var dict = []
    for(var i=0; i<orData.length; i++){
        const pData = await Items.find({_id: orData[i].pid})
        const addData = await Address.find({_id: orData[i].address})
        var data = {}
        data._id = orData[i]._id
        data.qty = orData[i].qty
        data.status = orData[i].status
        data.pdtName = pData[0].pdtName
        data.address = addData[0].address
        data.price = pData[0].cost*orData[i].qty
        dict.push(data)
    }

    res.send(JSON.stringify(dict));

})

server.post('/cancelOrder', async (req, res)=>{
    await Order.updateOne({_id : req.body.oid}, {status: "Cancelled"})
    res.send({code: 'ok'})
})

server.post('/delOrder', async (req, res)=>{
    await Order.deleteOne({_id: req.body.oid})
    res.send({code: 'ok'})
})

server.post('/getSeller', async (req, res)=>{
    const seller = await Seller.find({id: req.body.sid})
    res.send(seller[0])
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

server.post('/updateOrder', async (req, res)=>{
    await Order.updateOne({_id : req.body.oid}, {status: req.body.status})
    res.send({code: 'ok'})
})

server.listen(process.env.PORT, ()=>{
    console.log(`server started on ${process.env.PORT}`);
})