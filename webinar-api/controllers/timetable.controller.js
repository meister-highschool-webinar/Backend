const { timetable } = require('../models')

exports.getTimetable = async (req, res) => {
    try {
        const timetables = await timetable.findAll({
            attributes: ['track_name', 'speech', 'start_time', 'end_time']
        });
        res.send({timeTableList: timetables});
    } catch (e) {
        res.sendStatus(500);
    }
}