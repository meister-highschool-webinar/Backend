const { Sequelize } = require('sequelize');
const Timetable = require('./Timetable')


const sequelize = new Sequelize(
  process.env.MARIADB_DATABASE,
  process.env.MARIADB_ID,
  process.env.MARIADB_PASSWORD,
  {
    'host': process.env.MARIADB_IP,
    'dialect': 'mariadb',
    'define': {
      freezeTableName: true,
      timestamps: false
    }
  }
)

const user = require('./user/index')(sequelize, Sequelize);
const timetable = Timetable(sequelize);
const db = { Sequelize, sequelize, user, timetable }
module.exports = db
