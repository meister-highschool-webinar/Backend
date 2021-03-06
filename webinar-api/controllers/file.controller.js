const iconv = require('iconv-lite')
const { Parser } = require('json2csv');

const { chatLog, timetable, user } = require('../models')

exports.exportToFile = async(req, res) => {
    const dataName = req.query.dataName;
    let data, fields;
    switch (dataName) {
        case 'timetable':
            data = await timetable.findAll();
            fields = Object.keys(timetable.rawAttributes);
            break;
        case 'chatlog':
            data = await chatLog.findAll();
            fields = Object.keys(chatLog.rawAttributes);
            break;
        case 'user':
            data = await user.findAll();
            fields = Object.keys(user.rawAttributes);
            break;
        case 'question':
            data = await chatLog.findAll({
                where: {
                    question: 1
                }
            });
            fields = Object.keys(chatLog.rawAttributes);
            break;
        default:
            res.sendStatus(404);
            return
    }
    const parser = new Parser({ fields });
    data = parser.parse(data);
    res.attachment(`${dataName}.csv`);
    res.status(200).send(data);
}