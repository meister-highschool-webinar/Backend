const { Sequelize } = require('sequelize');

const { webinarTable } = require('../models')

exports.getWebinar = async (req, res) => {
  try {
    const webinar = await webinarTable.findByPk(req.params.id, {
      attributes: ['title', 'link', 'detail']
    });
    res.send(webinar);
  } catch (e) {
    res.sendStatus(404);
  }
}