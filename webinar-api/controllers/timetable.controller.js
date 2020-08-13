const { timetable } = require('../models')

exports.getTimetable = async (req, res) => {
    const timetables = await timetable.findAll({attributes: ['track_name', 'speech', 'start_time', 'end_time']})
    res.send({timeTableList: timetables})
}