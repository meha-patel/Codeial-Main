const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use new strategy for google login

passport.use(new googleStrategy({
    clientID: "520555730187-i08mv6gblod0us3ooiuch02n1i8een75.apps.googleusercontent.com",
    clientSecret: "bNjoW6j2u9773KlspZOMx80F",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
}, function(accessToken, refreshToken, profile, done) {
    User.findOne({
        email: profile.emails[0].value
    }).exec(function(err, user) {
        if (err) {
            console.log("Error in google strategy passport.", err);
            return;
        }
        if (user) {
            //if found set this user as req.user
            return done(null, user);
        } else {
            // if not found then create the user profile and set it as req.user
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex'),
            }, function(err, user) {
                if (err) {
                    console.log("Error in creating the user", err);
                }
                return done(null, user);
            })
        }

    })

}));

module.exports = passport;