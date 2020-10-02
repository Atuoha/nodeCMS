const express =  require('express');
const router = express.Router();
const Post = require('../../models/Post')


router.all('/*', (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res)=>{
    res.render('admin/posts/index')
})

router.get('/create', (req, res)=>{
    res.render('admin/posts/create-post')
});


router.post('/create', (req, res)=>{

    let allowComments = true;
    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }

    const newPost = new Post(
        {
            title: req.body.title,
            sub: req.body.sub,
            status: req.body.status,
            category: req.body.category,
            allowComments: allowComments,
            imagery: req.body.imagery,
            body: req.body.body
        }
    )
    newPost.save()
    .then(response=> console.log('Sent'))
    .catch(err=> console.log(err))
    res.redirect('/admin/posts')
    // res.send(`<p class="alert alert-success">Post created -Title: ${req.body.title}</p>`)
});

module.exports = router;