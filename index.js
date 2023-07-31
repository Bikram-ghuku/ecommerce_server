const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const server = express()
server.use(cors())
server.use(bodyParser.json())
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('DataBase Connected!'));

server.get('/', (req, res)=>{
    res.send("noob")
})

server.post('/register', (req, res)=>{
    console.log(req.body)
})

server.post('/login', (req, res)=>{
    var mailAdd = req.body.email
    res.send({name:'Hello world', email: mailAdd})
    console.log('data requested')
})

server.listen(8080, ()=>{
    console.log('server started on 8080');
})