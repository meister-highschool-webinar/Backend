const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const web = require('../modules/slack').slack();

const { user, schoolCode } = require('../models');

exports.signup = async function(req, res) {
    try {
        const param = Joi.object({
            schoolCode: Joi.string().required(),
            grade: Joi.number().integer().required(),
            class: Joi.number().integer().required(),
            number: Joi.number().integer().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        });
        if (param.validate(req.body).error) {
            res.status(400).send({
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

        const code = await schoolCode.findOne({
            where: {
                code: school_code
            },
            attributes: ['code', "name"]
        });

        const result = await user.findOne({
            where: {
                email
            },
            attributes: ['email']
        });

        if (result != null) return res.status(400).send({
            message: "중복된 사용자가 있습니다"
        });
        const hash = await bcrypt.hash(password, 10);
        const create_row = await user.create({
            school_name: code.dataValues.name,
            grade: grade,
            class: _class,
            number: number,
            email: email,
            password: hash
        }).then(result => {
            res.status(200).send({
                message: "회원가입을 성공하였습니다"
            })
        }).catch(err => {
            res.status(500).send({
                message: "회원가입을 하지 못하였습니다"
            })
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "서버에서 오류가 발생하였습니다."
        })
    }
};