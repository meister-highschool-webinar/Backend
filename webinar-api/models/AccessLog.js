const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('accesslog', {
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
        status: {
            type: DataTypes.STRING(255)
        },
        create_time: {
            type: DataTypes.DATE,
            allowNull: false,
            default: sequelize.fn('NOW')
        },
        ip: {
            type: DataTypes.STRING(255),
            allowNull: false,
            default: ""
        }
    }, {
        tableName: 'access_log',
        timestamps: false
    })
}