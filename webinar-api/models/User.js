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
        school_code: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        pw_hash: {
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