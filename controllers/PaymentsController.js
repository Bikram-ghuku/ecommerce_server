const stripe = require('stripe')(process.env.STRIPE_SK_KEY);

const Address = require('../models/AddressModel');
const Items = require('../models/ItemModel');
const Order = require('../models/OrdersModel');
const User = require('../models/UserModel');
const Seller = require('../models/SellerModel');

const stripeConfig = (req, res)=>{
    res.send({key: process.env.STRIPE_PU_KEY})
}

const createPaymentIntent = async (req, res)=>{
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
            amount: amount*100,
            currency: 'inr',
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.send({clientSecret: paymentIntent.client_secret})
    }catch(e){
        console.log(e)
    }
}

const getBill = async (req, res)=>{
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
}

module.exports = {
    stripeConfig,
    createPaymentIntent,
    getBill
}
