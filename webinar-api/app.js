const createError = require('http-errors');
const express = require('express');
const helmet = require("helmet");
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

const indexRouter = require('./routes');

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

app.use('/api', indexRouter);

app.get("/", function(req, res) {
    res.sendfile("index.html");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


module.exports = app;