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

    status:{
        type: String,
        default: 'Unapprove'
    },

    date:{
        type: Date
    }
})
module.exports = mongoose.model('comments', CommentSchema)