const { Sequelize } = require('sequelize');

const ChatLog = require('./ChatLog');
const User = require('./User');
const Timetable = require('./Timetable');
const WebinarTable = require('./WebinarTable');

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
    },
    logging: (query, data) => console.log({query, bind: data.bind}),
  }
);

const chatLog = ChatLog(sequelize);
const user = User(sequelize);
const timetable = Timetable(sequelize);
const webinarTable = WebinarTable(sequelize);

module.exports = { Sequelize, sequelize, chatLog, user, timetable, webinarTable }
