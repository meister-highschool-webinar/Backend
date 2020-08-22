const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('chatlog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER
    },
    student_name: {
      type: DataTypes.STRING(255)
    },
    text: {
      type: DataTypes.TEXT
    },
    create_time: {
      type: DataTypes.DATE,
      default: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'chat_log',
    timestamps: false
  })
}