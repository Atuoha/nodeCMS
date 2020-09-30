const express = require('express');
const server = express();
const path = require('path');
// const handlebars = require('express-handlebars')
const port = 1111 || process.env.Port

server.use(express.static(path.join(__dirname, 'public'))) // Loading Static files

// server.engine('handlebars', handlebars({defaultLayout: 'home'}))
// server.set('view engine', 'handlebars')

server.get('/', (req, res)=>{
    // res.render('home/index')
})

server.get('/about', (req, res)=>{
    // res.render('home/about')
})

server.get('/login', (req, res)=>{
    // res.render('home/login')
})


server.get('/register', (req, res)=>{
    // res.render('home/register')
})

server.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})