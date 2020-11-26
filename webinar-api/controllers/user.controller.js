const { user, schoolCode } = require('../models');
const { verifyJWT } = require("../middlewares/auth.middle");
const Joi = require('joi');
const getSession = (req) => {
    const result = (req.sessionStore.sessions) ? req.sessionStore.sessions : undefined;
    console.log(result, "login")
    return result;
};
exports.getUsertable = async(req, res) => {
    try {
        const param = Joi.object({
            pageSize: Joi.number().integer().required(),
            pageNum: Joi.number().integer().required(),
        });
        if (param.validate(req.query).error) {
            res.status(400).send({
                message: '입력값에 공란이 존재합니다.'
            })
        }

        const {
            pageSize: page_size,
            pageNum: page_num,
        } = req.query;
        const offset = page_size * (page_num - 1);
        const int_page_size = page_size * 1
        const all_users = await user.findAll({
            attributes: ['email']
        });
        const len = all_users.length
        const users = await user.findAll({
            attributes: ['id', 'student_name', 'email', 'class', 'grade', 'number', 'school_name'],
            offset: offset,
            limit: int_page_size
        });
        res.send({ userList: users, totalLength: len });
    } catch (e) {
        res.sendStatus(500);
    }
}
exports.getUserInfo = async(req, res) => {
    const accessToken = req.body.access_token;
    let foundUser = undefined;
    try {
        foundUser = await verifyJWT(accessToken, process.env.JWT_SALT);
    } catch (e) {
        return res.status(400).send({
            message: '입력된 토큰이 잘못되었습니다.'
        })
    }
    if (!foundUser || !foundUser.email) {
        return res.status(400).send({
            message: '입력된 토큰이 잘못되었습니다.'
        })
    }

    let passportEmail = foundUser.email;
    try {
        const userInfo = (await user.findOne({
            where: {
                email: passportEmail
            }
        })).dataValues;
        console.log(userInfo.school_name)
        const school = (await schoolCode.findOne({
            where: {
                name: userInfo.school_name
            }
        }));
        if (!school) {
            return res.status(400).send({
                message: '학교 이름이 잘못되었습니다.'
            })
        }
        userInfo.school_code = school.dataValues.code
        userInfo.student_id = userInfo.grade.toString() + userInfo.class.toString() + userInfo.number.toString()
        res.send({ userInfo, accessToken: userInfo.access_token });
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }
}
exports.deleteUser = async(req, res) => {
    try {
        const param = Joi.object({
            email: Joi.string().required(),
        });
        if (param.validate(req.body).error) {
            res.status(400).send({
                message: '입력값에 공란이 존재합니다.'
            })
        }

        const {
            email
        } = req.body;
        const users = await user.destroy({
            where: { email }
        }).then(result => {
            res.status(200).send({
                message: '유저 정보를 삭제하였습니다'
            })
        })
    } catch (e) {
        res.sendStatus(500);
    }
}