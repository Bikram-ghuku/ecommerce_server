const bcrypt = require('bcrypt')
const User = require('../models/UserModel')


const register = async (req, res)=>{
    const doc = await User.find({email: req.body.email})
    if(!doc[0]){
        bcrypt.hash(req.body.pswd, 10, function(err, hash) {
            let user = new User();
            user.name = req.body.name
            user.email = req.body.email
            user.password = hash
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
            res.status(201).send({code: 'ok'})
        }).catch(err => {
            res.status(500).send({code: 'Internal Server Error'})
        });
    }
    else{
        res.status(409).send({code: 'Account Already Present! Use a different account'})
    }
}

const login = async (req, res)=>{
    const doc = await User.find({email: req.body.email, password: req.body.pswd})
    var resData = doc[0]
    if(resData){
        if(!resData.allow){
            res.status(403).send({code: 'Account blocked by admin, please contact admin for more details'})
        }else{
            bcrypt.compare(req.body.pswd, resData.password, function(err, result) {
                res.status(200).send({name:resData.name, email:resData.email, code:'ok', type: resData.type, id: resData._id})
            }).catch(err => {
                res.status(500).send({code: 'Internal Server Error'})
            });
        }
    }
    else{
        res.sattus(401).send({code:'incorrect username or password'})
    }
}

module.exports = {
    register,
    login
}