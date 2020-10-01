const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars')
const port = 1234 || process.env.Port;

app.use(express.static(path.join(__dirname, 'public'))) // Loading Static files

// --SETTING view engine using handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        partialsDir: path.join(__dirname, "views/layouts/partials")
    
    }
    
    ))

app.set('view engine', 'handlebars')



// Routes
// --home
const home = require('./routes/home/main')
app.use('/', home)

// --admin
const admin =  require('./routes/admin/main');
app.use('/admin', admin)
// 

app.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})