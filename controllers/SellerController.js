const Seller = require('../models/SellerModel');

const getAllSellers = async (req, res)=>{
    const data = await Seller.find({});
    const dict = {}
    for(let i=0; i<data.length; i++){
        dict[data[i].id] = data[i].name
    }
    res.status(200).send(JSON.stringify(dict));
}

const getSeller = async (req, res)=>{
    const data = await Seller.find({_id: req.body.sid})
    res.status(200).send(JSON.stringify(data));
}

module.exports = {
    getAllSellers,
    getSeller
}