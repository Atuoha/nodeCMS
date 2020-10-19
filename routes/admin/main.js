const express = require('express');
const router = express.Router();
const User = require('../..//models/User')
const Post = require('../..//models/Post')
const Comment = require('../..//models/Comment')
const Reply = require('../..//models/Reply')
const Category = require('../..//models/Category')

// const {userAuth} = require('../../helpers/authenticate')

// router.all('/*', userAuth, (req, res, next)=>{

//     req.app.locals.layout = 'admin';
//     next();
// })


router.all('/*', (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res)=>{

    User.countDocuments()
    .then(users=>{
        Post.countDocuments()
        .then(posts=>{
            Comment.countDocuments()
            .then(comments=>{
                Reply.countDocuments()
                .then(replies=>{
                    Category.countDocuments()
                    .then(categories=>{
                         res.render('admin/index', {users: users, posts: posts, comments: comments, replies:replies, categories:categories})
                    })
                })
            })
        })
    })
    
   

    // Session Usage
    // req.session.tony = "Atuoha Anthony";
    // if(req.session.tony){
    //     console.log(`Am ${req.session.tony}`)
    // }

});




module.exports = router;
