const mongoose  = require('mongoose');
const Schema = mongoose.Schema


const CommentSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    // post:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'posts'
    // },

    msg:{
        type: String
    },

    approveComments:{
        type: Boolean,
        default: 'false'
    },

    date:{
        type: Date,
        default: new Date()
    },

    replies:[{
        type: Schema.Types.ObjectId,
        ref: 'replies'
    }]
})
module.exports = mongoose.model('comments', CommentSchema)