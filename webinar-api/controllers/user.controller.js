const { user } = require('../models');
const Joi = require('joi');

exports.getUsertable = async(req, res) => {
    try {
        const param = Joi.object({
            pageSize: Joi.number().integer().required(),
            pageNum: Joi.number().integer().required(),
        });
        if (param.validate(req.body).error) {
            res.status(400).send({
                message: '입력값에 공란이 존재합니다.'
            })
        }

        const {
            pageSize: page_size,
            pageNum: page_num,
        } = req.body;
        const offset = page_size * (page_num - 1);
        const users = await user.findAll({
            attributes: ['student_id', 'student_name', 'email', 'class', 'grade', 'number', 'school_name'],
            offset: offset,
            limit: page_size
        });
        res.send({ userList: users });
    } catch (e) {
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