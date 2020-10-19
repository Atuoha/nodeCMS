const mongoose =  require('mongoose')
const Schema = mongoose.Schema


const ReplySchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    reply:{
        type: String,
    },

    approveReply:{
        type: Boolean,
        default: false
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }
})

module.exports = mongoose.model('replies', ReplySchema);