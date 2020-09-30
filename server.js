const express = require('express');
const server = express();
const path = require('path');
const handlebars = require('express-handlebars')
const port = 1111 || process.env.Port

server.use(express.static(path.join(__dirname, 'public'))) // Loading Static files

// --SETTING view engine using handlebars
server.engine('handlebars', handlebars({defaultLayout: 'home'}))
server.set('view engine', 'handlebars')


// Routes
// --home
const home = require('./routes/home/main')
server.use('/', home)

// --admin
const admin =  require('/routes/admin/main');
server.use('/admin', admin)
// 

server.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})