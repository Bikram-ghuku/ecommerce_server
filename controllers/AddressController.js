const Address = require('../models/AddressModel');
const User = require('../models/UserModel');

const addAddress = async (req, res)=>{
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
}

const getAddress = async (req, res)=>{
    const doc = await Address.find({uid: req.body.uid})
    res.send(doc)
}

module.exports = {
    addAddress,
    getAddress
}
