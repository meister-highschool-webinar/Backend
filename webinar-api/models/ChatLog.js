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
            type: DataTypes.INTEGER
        },
        student_name: {
            type: DataTypes.STRING(255)
        },
        text: {
            type: DataTypes.TEXT
        },
        deleted_time: {
            type: DataTypes.DATE,
            default: sequelize.literal('CURRENT_TIMESTAMP')
        },
        create_time: {
            type: DataTypes.DATE,
        },
        question: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        deleted_flag: {
            type: DataTypes.BOOLEAN,
            default: false
        }
    }, {
        tableName: 'chat_log',
        timestamps: false
    })
}