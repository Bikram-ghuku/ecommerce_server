const Items = require('../models/ItemModel');

const getProductes = async (req, res)=>{
    const data = await Items.find({seller: req.body.sid})
    res.status(200).send(JSON.stringify(data));
}

const addProducts= async (req, res)=>{
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
    res.status(201).send({code: 'ok'})
}

const delProducts = async (req, res)=>{
    await Items.deleteOne({_id: req.body.pid})
    res.status(200).send({code: 'ok'})
}

const items = async (req, res)=>{
    const data = await Items.find({dispType :{$not: {$eq: "private"}}})
    res.status(200).send(JSON.stringify(data));
}


module.exports = {
    getProductes,
    addProducts,
    delProducts,
    items
}