const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const URLSlugs = require('mongoose-url-slugs')

const PostSchema = new Schema({

    title: {
        required: true,
        type: String,
        minLength: 5,
    },

    slug:{
        type: String
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


})

PostSchema.plugin(URLSlugs('title', {field: 'slug'})) //
module.exports = mongoose.model('posts', PostSchema)
