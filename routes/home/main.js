const express =  require('express')
const router = express.Router();
const Post = require('../../models/Post')
const Category = require('../../models/Category')
const User = require('../../models/User');
const bcrypt =  require('bcryptjs')
const passport  = require('passport');
const LocalStrategy = require('passport-local').Strategy

router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
})

router.get('/', (req, res)=>{

    Post.find()
    .populate('user')
    .then(posts =>{
        Category.find()
        .then(categories => {
         res.render('home/index', {posts: posts, categories: categories})
        }) 
        .catch(err => console.log(`Error with Categories ${err}`))
    })
    .catch(err => console.log(err))
})


//single page
router.get('/single_post/:id', (req, res)=>{   

    Post.findOne({_id: req.params.id})
    .populate('user')
    .then(post =>{
        Category.find()
        .then(categories => {
         res.render('home/single_post', {post: post, categories: categories})
        }) 
        .catch(err => console.log(`Error with Categories ${err}`))
    })
    .catch(err => console.log(err))

})


//pulling post by category id
router.get('/cat/:id', (req, res)=>{

    Post.find({category: req.params.id})
    .populate('user')
    .populate('category')
    .then(posts=>{
        Category.find()
        .then(categories=>{
            Category.findOne({_id: req.params.id})
            .then(cat=>{
                res.render('home/category_post', {posts: posts, categories: categories, cat: cat})
                console.log(`Posts: ${posts}`)
            })
            
        })
        
    })
    .catch(err=> console.log(err))
})

// pulling post by user_id
router.get('/author_post/:id', (req, res)=>{

    Post.find({user: req.params.id})
    .populate('user')
    .then(posts=>{
        Category.find()
        .then(categories=>{
            User.findOne({_id: req.params.id})
            .then(author=>{
                res.render('home/author_post', {posts: posts, categories: categories, author: author})
                console.log(`Posts: ${posts}`)
            })
           
        })
    })
    .catch(err=> console.log(err))
})

router.get('/login', (req, res)=>{
    res.render('home/login')
})


router.get('/register', (req, res)=>{
    res.render('home/register')
})


//Register User
router.post('/register', (req, res)=>{

    let errors = [];

    if(!req.body.fullname){
        errors.push({message: 'Fullname should not be empty'});
    }

    if(!req.body.email){
        errors.push({message: 'Email should not be empty'});
    }

    if(!req.body.password){
        errors.push({message: 'Password should not be empty'});
    }

    if(!req.body.passwordConfirm){
        errors.push({message: 'Confirm Password should not be empty'});
    }

    if(req.body.password !== req.body.passwordConfirm){
        errors.push({message: 'Password mismatch'});
    }
    
    if(errors.length > 0){
        res.render('home/register', 
        {
            errors: errors,
            fullname: req.body.fullname,
            email: req.body.email,
            
            
        
        }
        )
    }else{
      User.findOne({email: req.body.email})  // checking if mail exists 
      .then(user=>{
            if(user){
                req.flash('error_msg', `${req.body.email} has already been registered with us`)
                res.redirect('/register')
            }else{
                
                const newUser = new User({
                    fullname: req.body.fullname,
                    email: req.body.email,
                    password: req.body.password
                })
        
                bcrypt.genSalt(10, (err, salt)=>{                        // hashing pass
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{  
                        newUser.password = hash
                        newUser.save()
                        .then(user=>{
                            console.log(`New User: ${user}`)
                            req.flash('success_msg', 'User Registered Successfully. Login!')
                            res.redirect('/login')
                        })
        
                    })
                })

            }
      })
               
    }
  
})



// LOGIN SECTION

//passport setups
passport.use(new LocalStrategy({usernameField: 'email'},(email, password, done)=>{
        console.log(`Email: ${email} | Password: ${password}`)

        User.findOne({email: email})
        .then(user=>{
            if(!user){
                console.log('Email not recognised!');
                return done(null, false, {message: 'Email not recognised!'})
            }

            bcrypt.compare(password, user.password, (err, matched)=>{
                if(err) throw err;

                if(matched){
                    return done(null, user)
                    console.log(`${user.email} Logged In Successfully!`)                   
                }else{
                    return done(null, false, {message: 'Password mismatch. Try Again!'})
                }
            })
        })
        .catch(err=>{
            return done(console.log(err))
        })
    }   
))

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

router.post('/login', (req, res, next)=>{
    
  passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
  })(req, res, next)

})




// logout
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/')
})



module.exports = router;