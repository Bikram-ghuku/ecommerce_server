const Order = require('../models/Order')
const User = require('../models/UserModel')
const Seller = require('../models/SellerModel')
const Items = require('../models/ItemModel')

const getOrders = async (req, res)=>{
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
    
    res.status(200).send(JSON.stringify(dict));
}

const myOrders = async (req, res)=>{
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

    res.status(200).send(JSON.stringify(dict));

}

const cancelOrder = async (req, res)=>{
    await Order.updateOne({_id : req.body.oid}, {status: "Cancelled"})
    res.status(200).send({code: 'ok'})
}

const delOrder = async (req, res)=>{
    await Order.deleteOne({_id: req.body.oid})
    res.status(200).send({code: 'ok'})
}

const updateOrder =  async (req, res)=>{
    await Order.updateOne({_id : req.body.oid}, {status: req.body.status})
    res.status(200).send({code: 'ok'})
}

const addOrder = async (req, res)=>{
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
}

module.exports = {
    getOrders,
    myOrders,
    cancelOrder,
    delOrder,
    updateOrder,
    addOrder
}