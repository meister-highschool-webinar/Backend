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
const { user } = require('./models');
const indexRouter = require('./routes');
const { googleLogin, verifyOauthLogin } = require("./controllers/login.controller");

const app = express();
const getSession = (req) => {
    const result = (req.sessionStore.sessions) ? req.sessionStore.sessions : undefined;
    return result;
};
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
app.get('/auth/logout', function(req, res) {
    console.log(req)
    let passportEmail;
    try {
        let passportUser = undefined;
        const key = `"user_email":"${req.body.email}"`;
        for (const i of Object.values(getSession(req))) {
            if (i.startsWith(key)>-1) {
                passportUser = JSON.parse(i).passport;
                break;
            }
        }
        passportEmail = (passportUser) ? passportUser["user"]['user_email'] : undefined


        console.log()
    } catch (e) {
        console.log(e)
        return res.status(400).send({
            message: '세션이 잘못되었습니다.'
        })
    }
    req.logout();
    // req.session.destroy();
    // req.sessionStore.destroy();
    const create_row = user.update({
        access_token: null
    }, { where: { email: passportEmail } })
    res.send(200)
});
app.use('/api', indexRouter);

app.use(function(req, res, next) {

    next(createError(404));
});


module.exports = app;