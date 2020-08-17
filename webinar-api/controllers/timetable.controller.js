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

exports.inputTimetable = async(req, res) => {
    const { tableList } = req.body;

    try {
        const flag = tableList.every(tableInfo => {
            const {
                trackName,
                speech,
                startTime,
                endTime
            } = tableInfo;

            if(trackName === undefined || speech === undefined || startTime === undefined || endTime === undefined) {
                res.status(400).send({
                    msg: '입력되지 않은 항목이 존재합니다.',
                    msgId: 400
                })
                return false;
            }

            return true;
        })

        if(!flag) return;

        await Promise.all(
            tableList.map(async tableInfo => {
                const {
                    trackName: track_name,
                    speech,
                    startTime: start_time,
                    endTime : end_time
                } = tableInfo;

                await timetable.create({
                    track_name,
                    speech,
                    start_time,
                    end_time
                })
            })
        )

        res.send({
            msg: '성공적으로 타임 테이블을 입력하였습니다.',
            msgId: 200
        })
    }
    catch (e) {
        res.sendStatus(500);
    }
}