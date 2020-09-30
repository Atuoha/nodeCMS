const express = require('express');
const server = express();
const port = 1111 || process.env.Port

server.get('/', (req, res)=>{
    res.send('Home')
})

server.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})