const express = require('express')
const app = express();
const router =  express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');


// index of comment
router.get('/*', (req, res, next)=>{
    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res)=>{

    Comment.find()
    .populate('user')
    .then(comments=>{
        res.render('admin/comments', {comments: comments})
    })
    .catch(err=> console.log(err))
})

// updating comment with unapprove and approve
router.post('/update/:id', (req, res)=>{

    Comment.findOne({_id: req.params.id})
    .then(cmnt=>{
        cmnt.status = req.body.status
        cmnt.save()
        .then(savedCmt=>{
            console.log(`Status updated: ${savedCmt}`);
            req.flash('success_msg', 'Comment Updated :)');
            res.redirect('/comments');
        })
        .catch(err=>console.log(`Can't find comment due to: ${err}`))
    })
    .catch(err=>console.log(`Can't find comment due to: ${err}`))
})


// deleting comment
router.get('/:id/delete', (req, res)=>{

    Comment.findOne({_id: req.params.id})
    .then(cmnt=>{
        cmnt.delete()
        .then(res=>{
            req.flash('success_msg', 'Comment deleted successfully :)')
            res.redirect('/comments');
        })
        .catch(err=>console.log(err))        
    })
    .catch(err=>console.log(err))
})

// create comment
router.post('/create', (req, res)=>{
   
    Post.findOne({_id: req.body.post_id})
    .then(post=>{
        console.log(`Found Post: ${post}`)

        const newComment = new Comment({
            msg: req.body.msg,
            user: req.body.user_id,
            date: new Date()
        })

        post.comments.push(newComment);
        post.save()
        .then(saved=>{
            newComment.save()
            .then(savedCmt=>{
                console.log(`Commented: ${savedCmt}`)
                req.flash('success_msg', 'Your comment has been sent successfully :)');
                res.redirect(`/single_post/${post.id}`);
            })
            .catch(err=> console.log(`Error with saving comment: ${err}`))
        })
        .catch(err=> console.log(`Error linking with updating post comment field: ${err}`))
    })
})


module.exports = router;