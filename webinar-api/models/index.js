const { Sequelize } = require('sequelize');

const Timetable = require('./Timetable')

const sequelize = new Sequelize({
    username: process.env.DATABASE_ID,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'mariadb',
    dialectOptions: {
        timezone: 'Etc/GMT-9'
    }
});

const timetable = Timetable(sequelize);

module.exports = {
    sequelize,
    timetable
};
