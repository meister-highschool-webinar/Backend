const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const web = require('../modules/slack').slack();
const randtoken = require('rand-token')

const { user } = require('../models');


exports.refresh = async function(req, res) {
    try {
        const headers = req.headers;
        const { refreshToken, salt } = headers.authorization;
        const param = Joi.object({
            email: Joi.string().required(),
        });
        if (param.validate(req.body).error) {
            res.status(400).send({
                message: '공란이 존재합니다.'
            })
        }

        const {
            email
        } = req.body;

        const result = await user.findOne({
            where: {
                email
            },
            attributes: ['id', 'student_name', 'refresh_token']
        });
        if (!result || result.dataValues.refresh_token != refreshToken) {
            return res.status(400).send({
                message: "유효하지 않은 refresh token입니다"
            });
        }
        const currentTime = new Date();

        const accessToken = jwt.sign({
            ...result.dataValues
        }, process.env.JWT_SALT)

        await user.update({
            access_token: accessToken,
            token_create_time: currentTime
        }, {
            where: {
                email
            }
        })

        const responseData = {
            accessToken,
            userId: result.dataValues.id,
            studentName: result.dataValues.student_name,
        }

        res.status(200).send(responseData)
    } catch (error) {
        res.status(500).send({
            message: "서버에서 오류가 발생하였습니다."
        })
    }
};

exports.me = (req, res) => {
    try {
        const headers = req.headers;
        const { accessToken, salt } = headers.authorization;
        const param = Joi.object({
            email: Joi.string().required(),
        });
        if (param.validate(req.body).error) {
            res.status(400).send({
                message: '공란이 존재합니다.'
            })
        }

        const {
            email
        } = req.body;

        const result = await user.findOne({
            where: {
                email
            },
            attributes: ['id', 'student_name', 'access_token']
        });

        if (accessToken === result.dataValuesr.refresh_token) {
            res.status(500).send({
                message: "유효한 access token입니다"
            })
        } else {
            res.status(400).send({
                message: "유효한 access token이 아닙니다"
            })
        }

    } catch (error) {
        res.status(500).send({
            message: "서버에서 오류가 발생하였습니다."
        })
    }
}