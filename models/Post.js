const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlug = require('mongoose-url-slugs')

const PostSchema = new Schema({

    title: {
        required: true,
        type: String,
        minLength: 5,
    },

    sub: {
        required: true,
        type: String,
        minLength: 5,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
    },

    allowComments: {
        type: Boolean,
    },

    status: {
        required: true,
        type: String,
        minLength: 5,
    },

    file: {
        type: String,
        
    },

    body: {
        required: true,
        type: String,
        minLength: 20,
    },

    date:{
        type: Date
    },

    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    slug:{
        type: String
    }

})

module.exports = mongoose.model('posts', PostSchema)