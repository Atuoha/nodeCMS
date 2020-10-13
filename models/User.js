const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    
    fullname:{
        type: String,
        required: true,
        minLength: 6
    },

    email:{
        type: String,
        required: true,
        minLength: 5
    },

    password:{
        type: String,
    },

    role:{
        type: String,
        default: 'Subscriber'
    },

    status:{
        type: String,
        default: 'Unactive'
    },

    file:{
        type:String
    }

})

module.exports = mongoose.model('users', UserSchema)