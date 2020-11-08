const { timetable } = require('../models');
const Joi = require('joi');

exports.getTimetable = async(req, res) => {
    try {
        const timetables = await timetable.findAll({
            attributes: ['track_name', 'speech', 'start_time', 'end_time']
        });
        res.send({ timeTableList: timetables });
    } catch (e) {
        res.sendStatus(500);
    }
}

exports.inputTimetable = async(req, res) => {
    const { tableList } = req.body;

    try {
        const flag = tableList.every(tableInfo => {
            const param = Joi.object({
                track_name: Joi.string().required(),
                speech: Joi.string().required(),
                start_time: Joi.date().iso().required(),
                end_time: Joi.date().iso().required()
            })
            if (param.validate(tableInfo).error) {
                res.status(400).send({
                    msg: '공란이 존재합니다.',
                    msgId: 400
                })
                return false;
            }
            return true;
        })

        if (!flag) return;

        await Promise.all(
            tableList.map(async tableInfo => {
                const {
                    track_name,
                    speech,
                    start_time,
                    end_time
                } = tableInfo;

                await timetable.create({
                    track_name,
                    speech,
                    start_time,
                    end_time
                })
            })
        )

        res.send({
            msg: '성공적으로 타임 테이블을 입력하였습니다.',
            msgId: 200
        })
    } catch (e) {
        res.sendStatus(500);
    }
}