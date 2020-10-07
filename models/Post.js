const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        required: true,
        type: String,
        minLength: 5,
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

})

module.exports = mongoose.model('posts', PostSchema)