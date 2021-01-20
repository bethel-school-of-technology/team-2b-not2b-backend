// IMPORTING NECESSARY DEPENDANCIES
const jwt = require('jsonwebtoken');
const User = require('../models/user');



// module to hold multiple function
var tokenService = {
    // Creating a token when given user information
    assignToken: function (user) {
        const token = jwt.sign(
            {
                username: user.username,
                _id: user._id
            },
            'shinobiSecrets',
            {
                expiresIn: '6h'
            }
        )
        return token;
    },
    // Inspecting a token as input
    verifyToken: function (token) {
        try {
            let decoded = jwt.verify(token, 'shinobiSecrets');
            return User.findById(decoded._id);
        }
        catch (err) {
            return null;
        }
    }
}


module.exports = tokenService;
