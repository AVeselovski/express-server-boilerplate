const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define user model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: String
});

// on save hook, encrypt password
//
// before saving a model, run this function
userSchema.pre('save', function(next) {
    // get access to the user model
    const user = this;
    // generate a salt then callback
    bcrypt.genSalt(10, function(error, salt) {
        if (error) { return next(error); }
        // hash password using salt
        bcrypt.hash(user.password, salt, null, function(error, hash) {
            if (error) { return next(error); }
            // overwrite plain text password with encrypted password
            user.password = hash;
            next();
        });
    });
});

// compare passwords
userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
        if (error) { return callback(error); }

        callback(null, isMatch);
    });
}

// create the model class
const Model = mongoose.model('user', userSchema);

// export the model
module.exports = Model;
