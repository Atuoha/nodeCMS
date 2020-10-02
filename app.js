const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars')
const port = 1234 || process.env.Port;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Post = require('./models/Post') 

mongoose.connect('mongodb://localhost:27017/nodeCms', {useNewUrlParser: true, useUnifiedTopology: true })
    .then(db=> console.log('Connected'))
    .catch(err=> console.log(err))


app.use(express.static(path.join(__dirname, 'public'))) // Loading Static files like css, js and stuffs

// --SETTING view engine using handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        partialsDir: path.join(__dirname, "views/layouts/partials")
    
    }
    
    ))

app.set('view engine', 'handlebars')
// 

// Setting up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// 




// Routes
// --home
const home = require('./routes/home/main')
app.use('/', home)

// --admin
const admin =  require('./routes/admin/main');
app.use('/admin', admin)
// 

// -- admin posts
const posts = require('./routes/admin/posts');
app.use('/admin/posts', posts)
// 

app.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})