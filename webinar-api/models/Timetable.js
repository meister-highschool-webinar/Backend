const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('timetable', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        track_name: {
            type: DataTypes.STRING(255)
        },
        speech: {
            type: DataTypes.STRING(255)
        },
        start_time: {
            type: DataTypes.DATE
        },
        end_time: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'time_table',
        timestamps: false
    })
}