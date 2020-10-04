const express =  require('express');
const router = express.Router();
const Post = require('../../models/Post')
const faker = require('faker');

//settting default layout
router.all('/*', (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();
})


// viewing post all posts page and populating it with contents from database
router.get('/', (req, res)=>{

    Post.find({})
    .then(posts=> {
        res.render('admin/posts', {posts: posts})
        console.log(posts)
    })
    .catch(err=> console.log(`Post Error: err`))
    
})

//viewing creating post page
router.get('/create', (req, res)=>{
    res.render('admin/posts/create-post')
});


// creating post
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
            body: req.body.body,
            date: new Date(),
        }
    )
    newPost.save()
    .then(response=> console.log('Sent'))
    .catch(err=> console.log(err))
    res.redirect('/admin/posts')
    // res.send(`<p class="alert alert-success">Post created -Title: ${req.body.title}</p>`)
});


// viewing edit page using id
router.get('/:id/edit', (req, res)=>{

    Post.find({_id: req.params.id})
    .then(post=>{
        console.log(`Single post: ${post}`);
        res.render('admin/posts/edit', {post: post})
    })
    .catch(err=> console.log(`Error with pulling single post: ${err}`))
})



// updating post using id
// router.put('/:id/update',  (req, res)=>{
router.post('/:id/update',  (req, res)=>{
    let allowComments = true;
    if(req.body.allowComments){
        allowComments = true;
    }else{
        allowComments = false;
    }

    Post.findOne(
        {_id: req.params.id})
    .then(post=>{
        console.log(post)
        post.title = req.body.title;
        post.sub = req.body.sub;
        post.status = req.body.status;
        post.category = req.body.category;
        post.body = req.body.body;
        post.allowComments = allowComments;
        post.imagery = req.body.imagery;

        post.save()
         .then(updatedPost =>{
            console.log(`New Post: ${updatedPost}`);
            console.log('Updated Successfully');
            res.redirect('/admin/posts');
         })
         .catch(err => console.log(`Updating Error from: ${err}`))

       
    })
    .catch(err=> console.log(`Error from: ${err}`));
    
})

//deleting post using id
// router.delete('/:id/delete', (req, res)=>{
router.get('/:id/delete', (req, res)=>{

    Post.findOne({_id: req.params.id})   //you can still use remove function here but you won't be needing the "post.delete()" again to implement it
    .then(post=>{
        console.log(post)
        post.delete()
         .then(response => console.log(`Post Deleted: ${response}`))
         .catch(err => console.log(`Deleting Error from: ${err}`))
         res.redirect('/admin/posts')
    })
    .catch(err => console.log(`Error: ${err}`))
})



// generate dummy  data url to view page
router.get('/dummy', (req, res)=>{
    res.render('admin/dummy')
})


// posting dummy data using faker module
router.post('/generate-fake-posts', (req, res)=>{

    for(let i = 0; i < req.body.number; i++){
        let post = new Post()

        post.title = faker.name.title();
        post.sub = faker.name.suffix();
        post.category = faker.lorem.words();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.date = new Date()

        post.save()
        .then(posts =>{
            console.log(posts);
            res.redirect('/admin/posts')
        })
        .catch(err => console.log(err))
    }

})

// exporting router so that it can be used in app.js
module.exports = router;