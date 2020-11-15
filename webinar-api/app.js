const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const helmet = require("helmet");
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const indexRouter = require('./routes');
const { googleLogin, verifyOauthLogin } = require("./controllers/login.controller");

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
app.use(session({
    secret: process.env.KEY,
    cookie: { maxAge: 60 * 60 * 1000, secure: false },
    resave: true,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(async(user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_DOMAIN}/auth/google/callback`,
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
app.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: '/auth/google',
    successRedirect: '/auth/verify/oauth',
}));
app.get('/auth/verify/oauth', verifyOauthLogin);

app.use('/api', indexRouter);

app.use(function(req, res, next) {

    next(createError(404));
});


module.exports = app;