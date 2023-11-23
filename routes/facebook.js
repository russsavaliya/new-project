const router = require("express").Router();
const FacebookStrategy = require("passport-facebook").Strategy
const passport = require('passport');
router.use(passport.session());
router.use(passport.initialize());
const User = require("../models/User")

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
});


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.CALL_BACK_URL_FACEBOOK,
    profileFields: ['id', 'emails', 'displayName', 'photos', 'name', 'gender', 'profileUrl']
},
    async function (accessToken, refreshToken, profile, done) {
        console.log(accessToken, "profile");
        try {
            let user = await User.findOne({ email: profile.emails[0].value })
            if (user) {
                done(null, user)
            } else {
                user = await user.create({
                    email: profile.emails[0].value
                })
                done(null, user)
            }
        } catch (error) {

        }
    }
))


router.get('/login/fb', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/failed/login', (req, res, next) => {
    res.send('login failed');
});

router.get('/fb/auth', passport.authenticate('facebook',
    {
        failureRedirect: '/failed/login'
    }), function (req, res) {
        res.send('logged in to facebook');
    });

module.exports = router;

