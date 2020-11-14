const createError = require('http-errors');
const express = require('express');
const helmet = require("helmet");
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const indexRouter = require('./routes');
const { googleLogin } = require("./controllers/login.controller");

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.use(helmet());
app.use(logger('combined'));
app.use(cors({
    "origin": "*",
    "allowedHeaders": "Content-Type,x-access-token,Access-Control-Allow-Origin"
}));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
}, googleLogin));

/**
 * @swagger
 * /auth/google:
 *    get:
 *      tags:
 *          - Login
 *      summary: google OAuth.
 *      description: redirect to google login
 */
app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);
app.get("/auth/google/callback", passport.authenticate("google"));

app.use('/api', indexRouter);
// router.get('/verify/local', AuthHandler.verifyLocalLogin);

// router.get('/verify/oauth', AuthHandler.verifyOauthLogin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(process.env.SERVER_DOMAIN)
    next(createError(404));
});


module.exports = app;