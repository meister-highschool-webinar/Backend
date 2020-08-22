const { DataTypes } = require('sequelize');

/**
 * @swagger
 * definitions:
 *   timetable_list:
 *     type: array
 *     items:
 *       $ref: '#/definitions/timetable_item'
 *   timetable_item:
 *     type: object
 *     properties:
 *       track_name:
 *         type: string
 *         description: 트랙 이름
 *       speech:
 *         type: string
 *         description: 발표자
 *       start_time:
 *         type: string
 *         format: date-time
 *         description: 트랙 시작 시간
 *       end_time:
 *         type: string
 *         format: date-time
 *         description: 트랙 종료 시간
 */

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