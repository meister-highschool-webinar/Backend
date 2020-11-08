const Joi = require('joi');

const { webinarTable } = require('../models');
const e = require('express');

exports.getWebinar = async(req, res) => {
    try {
        const webinar = await webinarTable.findAll({
            limit: 1,
            attributes: ['title', 'link', 'detail'],
            order: [
                ['id', 'DESC']
            ]
        });
        if (webinar.length == 0) return res.status(400).send({
            message: "데이터가 없습니다"
        });

        res.send(webinar[0]);
    } catch (e) {
        res.sendStatus(500);
    }
}

exports.newWebinar = async(req, res) => {
    const bodyData = Joi.object({
        link: Joi.string().uri(),
        title: Joi.string().required(),
        detail: Joi.string().required()
    })

    if (bodyData.validate(req.body).error) {
        res.sendStatus(400);
        return;
    }

    try {
        let webinar = await webinarTable.create(req.body);
        delete webinar.dataValues.id;
        res.status(201).send(webinar);
    } catch (e) {
        res.sendStatus(500);
    }
}