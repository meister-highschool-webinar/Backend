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
        const userInfo = (await user.findOne({
            where: {
                email: user_email
            },
            attributes: ['student_name', 'email', 'school_name', "number", "grade", "class"]
        }))
        if (!userInfo) {
            await user.create({
                email: user_email,
                student_name: "",
                school_name: "",
                class: 0,
                grade: 0,
                number: 0
            }).then(result => {
                return cb(undefined, { user_email, requireSign: true })
            }).catch(err => {
                res.status(400).send({
                    message: "구글 로그인을 하지 못하였습니다"
                })
            });

        }
        if (!userInfo.school_name) {
            return cb(undefined, { user_email })
        }
        const userInfo_res = (await user.findOne({
            where: {
                email: user_email
            },
            attributes: ['student_name', 'email', 'school_name', "number", "grade", "class"]
        })).dataValues;
        const accessToken = jwt.sign({
            student_name: userInfo_res.student_name,
            school_name: userInfo_res.name,
            grade: userInfo_res.grade,
            class: userInfo_res.class,
            number: userInfo_res.number,
            email: userInfo_res.email
        }, process.env.JWT_SALT)
        console.log(userInfo_res, "user")
        const create_row = await user.update({
            access_token: accessToken
        }, { where: { email: user_email } }).then(result => {
            return cb(undefined, { userInfo: userInfo_res, accessToken, isLogin: true })
        }).catch(err => { return cb(undefined, {}); });

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
            // 회원가입 필요 없음
            if (session['isLogin']) {
                res.redirect(`${process.env.CLIENT_DOMAIN}`);
                return res.status(200).send({ userInfo: session["userInfo"], accessToken: session["accessToken"] });
            } else {
                res.redirect(`${process.env.CLIENT_DOMAIN}/signup?email=${session['user_email']}`);
            }
            return;
        }
        res.redirect(`${process.env.CLIENT_DOMAIN}/login`);


    } catch (error) {
        res.redirect(`${process.env.CLIENT_DOMAIN}/login`);
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