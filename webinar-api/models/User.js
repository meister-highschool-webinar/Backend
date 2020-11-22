const { DataTypes } = require('sequelize');

module.exports = (sequelize) => (
    sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        student_name: {
            type: DataTypes.STRING
        },
        school_name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        grade: {
            type: DataTypes.INTEGER
        },
        class: {
            type: DataTypes.INTEGER
        },
        login_flag: {
            type: DataTypes.INTEGER
        },
        number: {
            type: DataTypes.INTEGER
        },
        access_token: {
            type: DataTypes.STRING
        }
    })
)