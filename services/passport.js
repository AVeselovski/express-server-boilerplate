const passport = require('passport');
const User = require('../models/user');
// config file must be created first in project root
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// setup options for local Strategy
const localOptions = {
    usernameField: 'email'
}

// create local Strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
    // verify this email and password,
    // call 'done' with that user if correct credentials
    // otherwise, call 'done' with false
    User.findOne({ email: email }, function(error, user) {
        if (error) { return done(error); }
        if (!user) { return done(null, false); }

        // compare passwords
        user.comparePassword(password, function(error, isMatch) {
            if (error) { return done(error); }
            if (!isMatch) { return done(null, false); }

            return done(null, user);
        });
    });
});

// setup options for JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // see if user ID in the payload exists in database
    User.findById(payload.sub, function(error, user) {
        if (error) { return done(error, false); }

        if (user) {
            // if it does, call 'done' with that user
            done(null, user);
        } else {
            // otherwise, call 'done' without a user object
            done(null, false);
        }
    });
});

// tell passport to use these Strategies
passport.use(jwtLogin);
passport.use(localLogin);
