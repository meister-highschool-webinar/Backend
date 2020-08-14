const { Sequelize } = require('sequelize');
const Timetable = require('./Timetable');

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

const user = require('./user/index')(sequelize, Sequelize);
const timetable = Timetable(sequelize);

module.exports = { Sequelize, sequelize, user, timetable }
