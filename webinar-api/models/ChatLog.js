const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('chatlog', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        msg_id: {
            type: DataTypes.STRING(255)
        },
        student_name: {
            type: DataTypes.STRING(255)
        },
        text: {
            type: DataTypes.TEXT
        },
        question: {
            type: DataTypes.BOOLEAN,
        },
        deleted_time: {
            type: DataTypes.DATE,
            default: sequelize.literal('CURRENT_TIMESTAMP')
        },
        create_time: {
            type: DataTypes.DATE,
        },
        deleted_flag: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        tableName: 'chat_log',
        timestamps: false
    })
}