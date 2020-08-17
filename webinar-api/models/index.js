const { Sequelize } = require('sequelize');

const User = require('./User');
const Timetable = require('./Timetable');
const WebinarTable = require('./WebinarTable')

const sequelize = new Sequelize(
  {
    username: process.env.MARIADB_ID,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    host: process.env.MARIADB_IP,
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-9'
    },
    'define': {
      freezeTableName: true,
      timestamps: false
    }
  }
);

const user = User(sequelize);
const timetable = Timetable(sequelize);
const webinarTable = WebinarTable(sequelize);

module.exports = { Sequelize, sequelize, user, timetable, webinarTable }
