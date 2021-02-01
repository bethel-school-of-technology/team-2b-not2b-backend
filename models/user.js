// firstName, lastName, email, username, password

var mongoose = require('mongoose');
var uniqueValidator = require("mongoose-unique-validator"); // Plugin to help apply an extra hook that check data before saving to DB

var userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(uniqueValidator);

var User = mongoose.model('user', userSchema);

module.exports = User;
