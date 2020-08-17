const { DataTypes } = require('sequelize');

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