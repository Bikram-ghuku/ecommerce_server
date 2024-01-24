const User = require('../models/UserModel')

const cartItems =  async (req, res)=>{
    const doc = await User.find({_id: req.body.id})
    if(doc[0]){
        res.send(doc[0].cart)
    }
}

const addCartItem = async(req, res) => {
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
    
}

const removeCart = async (req, res)=>{
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
}

module.exports = {
    cartItems,
    addCartItem,
    removeCart
}