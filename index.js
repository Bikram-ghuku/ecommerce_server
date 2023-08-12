const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const server = express()
server.use(cors())
server.use(bodyParser.json())
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('DataBase Connected!'));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cart: Array,
    type: String
});

const User = mongoose.model('User', userSchema)

const itemsSchema = new mongoose.Schema({
    pdtNamae: String,
    img: String,
    desc: String,
    cost: String,
    opts: Array
})

const items = mongoose.model('items', itemsSchema);

server.post('/register', async (req, res)=>{
    const doc = await User.find({email: req.body.email})
    if(!doc[0]){
        let user = new User();
        user.name = req.body.name
        user.email = req.body.email
        user.password = req.body.pswd
        user.cart = []
        user.type = req.body.type

        user.save()
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
        res.send({name:resData.name, email:resData.email, code:'ok', type: resData.type, id: resData._id})
    }
    else{
        res.send({code:'incorrect username or password'})
    }
})

server.get('/items', async (req, res)=>{
    const data = await items.find({})
    res.send(JSON.stringify(data));
})

server.post('/cartItems', async (req, res)=>{
    const doc = await User.find({_id: req.body.id})
    if(doc[0].cart){
        res.send(doc[0].cart)
    }
})

server.post('/addCartItems', async(req, res) => {
    const doc = await User.find({_id: req.body.uid})
    var cartDet = doc[0].cart
    cartDet.push(req.body.pid)
    await User.updateOne({_id : req.body.uid}, {cart: cartDet})
})

server.listen(8080, ()=>{
    console.log('server started on 8080');
})