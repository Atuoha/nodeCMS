const mongoose = require('mongoose');
const Schema = mongoose.Schema

const categorySchema = new Schema({

    title:{
        type: String,
        minLength: 5,
        required: true
    },

    date:{
        type: Date
    }
})

module.exports = mongoose.model('categories', categorySchema)