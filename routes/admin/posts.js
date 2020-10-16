const express =  require('express');
const router = express.Router();
const Post = require('../../models/Post')
const faker = require('faker');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const path = require('path');
const fs = require('fs');
const Category = require('../../models/Category')
const {userAuth} = require('../../helpers/authenticate')



//settting default layout
router.all('/*',  (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();
})


// viewing post all posts page and populating it with contents from database
router.get('/', (req, res)=>{

    Post.find({})
    .populate('category')
    .populate('user')
    .then(posts=> {
        res.render('admin/posts', {posts: posts})
        // console.log(posts)
    })
    .catch(err=> console.log(`Post Error: err`))
    
})

//viewing creating post page
router.get('/create', (req, res)=>{

    Category.find()
     .then(categories =>{
         res.render('admin/posts/create-post', {categories: categories })
     })
});


// creating post
router.post('/create', (req, res)=>{

    let errors = [];

    if(!req.body.title){
        errors.push({message: 'Please add title'})
    }

    if(!req.body.body){
        errors.push({message: 'Please add body'})
    }

    if(!req.body.sub){
        errors.push({message: 'Please add sub title'})
    }

    if(errors.length > 0){
        res.render('admin/posts/create-post', {errors: errors})
    }else{


    let filename = Date.now() + '-' + 'img_place.png';

    if(!isEmpty(req.files)){

         // uploading file
    file = req.files.file
    filename = Date.now() + '-' + file.name
    let dirUpload = './public/uploads/'
    file.mv(dirUpload + filename, err=>{
        if(err) throw err;
    })
    //

    }

    
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
            file: filename,
            body: req.body.body,
            user: req.user.id,
            date: new Date(),
        }
    )
    newPost.save()
    .then(post=> {
        console.log(`Sent Post: ${post}`);
        req.flash('success_msg', `Post: ${post.title} has been created :)`)
        // console.log(req.flash('success_msg'));
        res.redirect('/admin/posts')

    })
    .catch(err=> console.log(err))

    }
    // res.send(`<p class="alert alert-success">Post created -Title: ${req.body.title}</p>`)
});


// viewing edit page using id
router.get('/:id/edit', (req, res)=>{

    Post.findOne({_id: req.params.id})
    .then(post=>{
        Category.find()
        .then(categories =>{
            console.log(`Single post: ${post}`);
            res.render('admin/posts/edit', {post: post, categories: categories})
            console.log(categories)
        })        
    })
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

        let filename = post.file;
        if(!isEmpty(req.files)){
            let file = req.files.file
            filename = Date.now() + '-' + file.name
            file.mv('./public/uploads/' + filename, err=>{
                if(err) throw err;
            })
        }

        post.title = req.body.title;
        post.sub = req.body.sub;
        post.status = req.body.status;
        post.category = req.body.category;
        post.body = req.body.body;
        post.allowComments = allowComments;
        post.file = filename;
        post.user =  req.user.id;


        post.save()
         .then(updatedPost =>{
            console.log(`New Post: ${updatedPost}`);
            console.log('Updated Successfully');
            req.flash('success_msg', `Post has successfully been updated. New title is ${updatedPost.title}`)
            res.redirect('/admin/posts');
         })
         .catch(err => console.log(`Updating Error from: ${err}`))

       
    })
    .catch(err=> console.log(`Error from: ${err}`));
    
})

//deleting post using id
// router.delete('/:id/delete', (req, res)=>{
router.get('/:id/delete', (req, res)=>{

    Post.findOne({_id: req.params.id}) 
      //you can still use remove function here but you won't be needing the "post.delete()" again to implement it
      .populate('comments')
    .then(post=>{
        console.log(post)
        if(post.file !== 'img_place.png'){ // I used img_place.png for a default image for dummy post and i don't want to delete it
            fs.unlink('./public/uploads/' + post.file, err=>{
                if(err) throw err;
            })
        }

        
       
        post.delete()
         .then(post => {

            if(post.comments.length > 0){
                post.comments.forEach(comment=>{
                    comment.delete()
                    .then(res=>{
                        console.log(`Comments Deleted ${res}`)
                    })
                    .catch(err=>console.log(err))
                })
                      
            }

            console.log(`Post Deleted: ${post}`);
            req.flash('success_msg', `Post: "${post.title}" and related comments has been deleted without errors :)`)
            res.redirect('/admin/posts')

        })
         .catch(err => console.log(`Deleting Error from: ${err}`))
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
        post.sub = faker.random.words();
        post.category = faker.lorem.word();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.file = 'img_place.png';
        post.author = user.id;
        post.date = new Date()

        post.save()
        .then(posts =>{
            console.log(posts);
            req.flash('success_msg', `Created ${req.body.number} dummy post(s) :)`)
            res.redirect('/admin/posts')

        })
        .catch(err => console.log(err))
    }

})


// viewing logged in posts
router.get('/myPost/:id', (req, res)=>{

    Post.find({user: req.params.id})
    .populate('user')
    .populate('category')
    .then(posts=>{
        res.render('admin/posts/loggedInUser_Post', {posts: posts})
    })
    .catch(err=> console.log(err))
})

// exporting router so that it can be used in app.js
module.exports = router;