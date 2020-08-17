const Joi = require('joi');

const { webinarTable } = require('../models')

exports.getWebinar = async (req, res) => {
  try {
    const pathParam = Joi.object({
      id: Joi.number().integer().required()
    });
    if (pathParam.validate(req.body).error) {
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