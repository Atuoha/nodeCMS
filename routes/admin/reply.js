const express =  require('express');
const app = express();
const Reply = require('../../models/Reply')
const User = require('../../models/User')
const Comment = require('../../models/Comment')
const router = express.Router()


router.get('/*', (req, res, next)=>{

    req.app.locals.layout = 'admin'
    next()
})

// Pulling all replies
router.get('/', (req, res)=>{

    Reply.find()
    .populate('user')
    .then(replies=>{
        res.render('admin/replies', {replies: replies})
    })
    .catch(err=> console.log(err))
})


// pulling all replies by logged in user
router.get('/myReplies/:id', (req, res)=>{

    Reply.find({user: req.params.id})
    .populate('user')
    .then(replies=>{
        res.render('admin/replies/loggedInUser_Replies', {replies: replies})
    })
    .catch(err=> console.log(err))
})

router.post('/create', (req, res)=>{

    if(!req.user){
        req.flash('success_msg', 'Your not logged in :)')
        res.redirect(`/single_post/${req.body.post}`)  
    }

    Comment.findOne({_id: req.body.comment})
    .then(comment=>{
        const newReply =  new Reply()
        newReply.reply = req.body.reply
        newReply.user = req.user.id,
        newReply.comment = req.body.comment,
        newReply.date = new Date()

        comment.replies.push(newReply)
        comment.save()
        .then(cmtSaved=>{
            newReply.save()
            .then(saved=>{
                console.log(`Reply is saved :) ${saved}`)
                req.flash('success_msg', 'Your reply has been sent successfully :)')
                res.redirect(`/single_post/${req.body.post}`)         
            })
            .catch(err=> console.log(`Error with saving reply ${err}`))
        })
        .catch(err=> console.log(`Error with saving comments ${err}`))
        
    }) 
    .catch(err=> console.log(`Error with pulling comments ${err}`))
})


// updating replies
router.post('/update/:id', (req, res)=>{
    Reply.findOne({_id: req.params.id})
    .then(reply=>{
        reply.approveReply = req.body.approveReply
        reply.save()
        .then(saved=>{
            req.flash('success_msg', 'Reply has been updated :)')
            res.redirect('admin/replies')
        })
    .catch(err=> console.log(`Can't update reply due to: ${err}`))

    })
    .catch(err=> console.log(`Can't find reply due to: ${err}`))

})


// deleting replies
router.get('/:id/delete', (req, res)=>{

    Reply.findOne({_id: req.params.id})
    .then(reply=>{
        reply.delete()
        .then(response=>{
            Comment.findOneAndUpdate({replies: req.paramas.id}, {$pull:{replies: req.params.id}}, (err, data)=>{
                if(err) throw err;
                req.flash('success_msg', 'Reply has been deleted :)')
                res.redirect('admin/replies')
            })
        })
        .catch(err=> console.log(`Can't delete reply due to: ${err}`))
    })
    .catch(err=> console.log(`Can't find reply due to: ${err}`))

})

module.exports = router;

