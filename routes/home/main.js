const express =  require('express')
const router = express.Router();
const Post = require('../../models/Post')
const Category = require('../../models/Category')


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = 'home';
    next();
})

router.get('/', (req, res)=>{

    Post.find()
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
    .then(post =>{
        Category.find()
        .then(categories => {
         res.render('home/single_post', {post: post, categories: categories})
        }) 
        .catch(err => console.log(`Error with Categories ${err}`))
    })
    .catch(err => console.log(err))

})

router.get('/login', (req, res)=>{
    res.render('home/login')
})


router.get('/register', (req, res)=>{
    res.render('home/register')
})


module.exports = router;