const router = require("express").Router();
const GoogleStrategy = require("passport-google-oauth2").Strategy
const passport = require('passport');
const User = require("../models/User")
router.use(passport.session());
router.use(passport.initialize());

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALL_BACK_URL_GOOGLE,
    // passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        console.log(refreshToken, "dsa");
        try {
            let user = await User.findOne({ email: profile.email })
            if (user) {
                done(null, user)
            } else {
                let user = await User.findOne({
                    email: profile.email
                })
                done(null, user)
            }
        } catch (error) {

        }
    }
));


router.get('/', (req, res) => {
    res.send("<button><a href='/user'>Login With Google</a></button>")
});

// Auth 
router.get('/user', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));

// Auth Callback
router.get('/user/callback',
    passport.authenticate('google', {
        successRedirect: '/user/callback/success',
        failureRedirect: '/user/callback/failure'
    }));

// Success 
router.get('/user/callback/success', (req, res) => {
    if (!req.user)
        res.redirect('/user/callback/failure');
    res.send("Welcome " + req.user.email);
});

// failure
router.get('/user/callback/failure', (req, res) => {
    try {

    } catch (error) {
        console.log(error, "error")
        res.send("Error");
    }
})

router.get('/logout', function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;

