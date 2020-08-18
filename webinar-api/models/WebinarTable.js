const { DataTypes } = require('sequelize');

/**
 * @swagger
 *  definitions:
 *   webinar-item:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *         description: 웨비나 타이틀
 *       link:
 *         type: string
 *         format: uri
 *         description: 웨비나 유튜브 링크
 *       detail:
 *         type: string
 *         description: 웨비나 소개
 */

module.exports = (sequelize) => {
  return sequelize.define('webinartable', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    link: {
      type: DataTypes.STRING(255)
    },
    title: {
      type: DataTypes.STRING(255)
    },
    detail: {
      type: DataTypes.TEXT
    }
  }, {
    tableName: 'webina_table',
    timestamps: false
  })
}