const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const web = require('../modules/slack').slack();
const randtoken = require('rand-token')

const { user } = require('../models');


const getPassportSession = (req) => {
    const result = req.user;
    return result;
};

const getSession = (req) => {
    const result = (req.session) ? req.session : undefined;
    return result;
};

exports.googleLogin = async function(
    accessToken, refreshToken, profile, cb) {
    try {
        const user_email = profile.emails[0].value;
        const userInfo = await user.findOne({
            where: {
                email: user_email
            },
            attributes: ['student_name', 'email', 'school_name', "number", "grade", "class"]
        });
        if (!userInfo) {
            await user.create({
                email: user_email,
                student_name: "",
                school_name: "",
                class: 0,
                grade: 0,
                number: 0
            }).then(result => {
                return cb(undefined, { user_email })
            }).catch(err => {
                res.status(500).send({
                    message: "구글 로그인을 하지 못하였습니다"
                })
            });
            const {
                studentName: student_name,
                email,
                schoolName: school_name,
                class: _class,
                grade,
                number,
            } = userInfo;
            return cb(undefined, {
                studentName,
                id,
                schoolName,
                email,
                grade,
                number,
                class: _class
            });
        }
    } catch (error) {
        return cb(undefined, {});
    }
}
exports.getSessionInfo = async(req, res) => {
    const sessionInfo = req.user || {};
    res.send(sessionInfo);
}


exports.verifyOauthLogin = async function(req, res) {
    try {
        const session = getPassportSession(req);
        if (session) {
            if (session['studentName']) {
                res.redirect(`${process.env.CLIENT_DOMAIN}?studentName=${session['studentName']}`);
            } else {
                res.redirect(`${process.env.CLIENT_DOMAIN}/signUp`);
            }
            return;
        }
        res.redirect(`${process.env.CLIENT_DOMAIN}?statusCode=401`);


    } catch (error) {
        res.redirect(`${process.env.CLIENT_DOMAIN}?statusCode=401`);
    }
}


exports.adminLogin = (req, res) => {
    if (req.body.password !== process.env.access_token) {
        if (req.body.password === process.env.access_t0ken) {
            web.chat.postMessage({
                text: `admin-access-token 채널의 토큰을 \`${req.ip}\`에서 이용하였습니다.`,
                channel: process.env.SLACK_NOTIFIER
            });
        }
        res.sendStatus(403);
        return;
    }

    const accessToken = jwt.sign({
        token: process.env.access_token
    }, process.env.JWT_ADMIN_SALT)
    const responseData = {
        accessToken
    }
    res.status(200).send(responseData)
}