const express = require('express');
const app = express();
const path = require('path');
const handlebars = require('express-handlebars');
const Handlebars = require('Handlebars')
const port = 1234 || process.env.Port;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
// const methodOverride = require('method-override')
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport')
// const {mongoDbURl} = require('./config/database')


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/nodeCms', {useNewUrlParser: true, useUnifiedTopology: true })
    .then(db=> console.log('Connected'))
    .catch(err=> console.log(err))

app.use(express.static(path.join(__dirname, 'public'))) // Loading Static files like css, js and stuffs


// custom select handlebars function
const {select, generate_date} = require('./helpers/handlebars-helpers')



// --SETTING view engine using handlebars
app.engine('handlebars', handlebars(
    {
        defaultLayout: 'home',
        helpers:{select: select, generate_date: generate_date},
        partialsDir: path.join(__dirname, "views/layouts/partials"),
        handlebars: allowInsecurePrototypeAccess(Handlebars)
    
    }
    
))

// upload middleware
app.use(upload())

// setting view engine
app.set('view engine', 'handlebars')
// 


// Setting up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// 


// Session Middleware
app.use(session({
    secret: 'tonyAtuoha',
    resave: true,
    saveUninitialized: true
}));

// Flash Middleware
app.use( flash() );

//Passport inits
app.use(passport.initialize());
app.use(passport.session());

// sETTing local variable for flash msgs
app.use( (req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null

    next();
})



// setting method override
// app.set(methodOverride(_method))


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

// -- admin categories
const category = require('./routes/admin/category');
app.use('/admin/categories', category)

// -- admin users
const user = require('./routes/admin/user');
app.use('/admin/users', user);

app.listen(port, ()=>{
    console.log(`listening to port: ${port}`)
})