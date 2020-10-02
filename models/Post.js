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
        default: true,
    },

    status: {
        required: true,
        type: String,
        minLength: 5,
    },

    imagery: {
        required: true,
        type: String,
    },

    body: {
        required: true,
        type: String,
        minLength: 20,
    },

})

module.exports = mongoose.model('posts', PostSchema)