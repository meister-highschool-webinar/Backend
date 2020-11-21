const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const web = require('../modules/slack').slack();

const { user, schoolCode } = require('../models');
const getPassportSession = (req) => {
    const result = req.user;
    console.log(result)
    return result;
};

const getSession = (req) => {
    const result = (req.sessionStore.sessions) ? req.sessionStore.sessions : undefined;
    return result;
};
exports.signup = async function(req, res) {
    console.log(req, "signup")
    let passportEmail;
    try {
        const passportUser = JSON.parse(Object.values(getSession(req))[0]).passport;
        passportEmail = (passportUser) ? passportUser["user"]['user_email'] : undefined

    } catch {
        return res.status(400).send({
            message: '세션이 잘못되었습니다.'
        })
    }

    try {
        const param = Joi.object({
            schoolCode: Joi.string().required(),
            grade: Joi.number().integer().required(),
            class: Joi.number().integer().required(),
            number: Joi.number().integer().required(),
            email: Joi.string().required(),
            studentName: Joi.string().required()
        });
        if (param.validate(req.body).error) {
            return res.status(400).send({
                message: '공란이 존재합니다.'
            })
        }

        const {
            schoolCode: school_code,
            grade,
            class: _class,
            studentName: student_name,
            number,
            email,
            password
        } = req.body;

        if (email != passportEmail) return res.status(400).send({
            message: "요청하신 이메일이 잘못되었습니다"
        });
        const code = await schoolCode.findOne({
            where: {
                code: school_code
            },
            attributes: ['code', "name"]
        });
        if (!code) return res.status(400).send({
            message: "학교 코드가 잘못 되었습니다"
        });
        const email_check = await user.findOne({
            where: {
                email
            },
            attributes: ['email']
        });
        if (!email_check) return res.status(400).send({
            message: "가입되어 있지 않습니다"
        });
        const result = await user.findOne({
            where: {
                email
            },
            attributes: ['number']
        }).then(result => {
            console.log(result.dataValues.number)
            if (result.dataValues.number) return res.status(400).send({
                message: "이메일이 중복된 사용자가 있습니다"
            });
        }).catch(err => {
            res.status(400).send({
                message: "회원가입을 하지 못하였습니다"
            })
        });


        const create_row = await user.update({
            student_name: student_name,
            school_name: code.dataValues.name,
            grade: grade,
            class: _class,
            number: number
        }, { where: { email: email } }).then(result => {
            const user_info = {
                student_name: student_name,
                school_name: code.dataValues.name,
                grade: grade,
                class: _class,
                number: number,
                email: email
            }
            res.status(200).send({
                userInfo: user_info,
                message: "회원가입을 성공하였습니다"
            })
        }).catch(err => {
            res.status(400).send({
                message: "회원가입을 하지 못하였습니다"
            })
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "서버에서 오류가 발생하였습니다."
        })
    }
};