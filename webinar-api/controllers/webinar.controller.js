const Joi = require('joi');

const { webinarTable } = require('../models')

exports.getWebinar = async (req, res) => {
  try {
    const pathParam = Joi.object({
      id: Joi.number().integer().required()
    });
    if (pathParam.validate(req.params).error) {
      res.sendStatus(404);
      return;
    }
    const webinar = await webinarTable.findByPk(req.params.id, {
      attributes: ['title', 'link', 'detail']
    });
    res.send(webinar);
  } catch (e) {
    res.sendStatus(404);
  }
}

exports.newWebinar = async (req, res) => {
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