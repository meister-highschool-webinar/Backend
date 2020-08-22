const { DataTypes } = require('sequelize');

module.exports = (sequelize) => (
  sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER
    },
    school_name: {
      type: DataTypes.STRING
    },
    student_name: {
      type: DataTypes.STRING
    },
    grade: {
      type: DataTypes.INTEGER
    },
    class: {
      type: DataTypes.INTEGER
    },
    lucky_flag: {
      type: DataTypes.INTEGER
    },
    login_flag: {
      type: DataTypes.INTEGER
    },
    number: {
      type: DataTypes.INTEGER
    }
  })
)