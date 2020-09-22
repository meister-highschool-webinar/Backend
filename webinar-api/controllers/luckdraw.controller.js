const { fn, Op } = require('sequelize');
const { io } = require('../modules/websocket');
const Joi = require('joi');

const { user } = require('../models');

exports.resetWinnerList = async (req, res) => {
  try {
    await user.update({
      lucky_flag: 0
    }, {
      where: {
        lucky_flag: {
          [Op.ne]: 0
        }
      }
    })

    return res.status(200).send({
      msg: 'success',
      msgId: 200
    })
  } catch (error) {
    return res.status(500).send({
      msg: 'Internal server error',
      msgId: 500
    })
  }
}

exports.getWinnerList = async (req, res) => {
  try {
    const winnerList = Array(10).fill({})
    const winnersInfo = await user.findAll({
      order: [['lucky_flag', 'ASC']],
      attributes: ['lucky_flag', 'school_name', 'grade', 'class', 'number', 'student_name'],
      where: {
        lucky_flag: {
          [Op.ne]: 0
        }
      }
    })
    winnersInfo.forEach(winnerInfo => {
      const info = winnerInfo.dataValues;
      winnerList[info.lucky_flag - 1] = info;
    });
    res.status(200).send(winnerList)

  } catch {
    res.status(500).send({
      msg: "서버에서 오류가 발생하였습니다.",
      msgId: 500
    })
  }
}

exports.startLuckdraw = async (req, res) => {
  const school = ["광주소프트웨어마이스터고등학교",
    "대덕소프트웨어마이스터고등학교",
    "대덕소프트웨어마이스터고등학교",
    "대구소프트웨어마이스터고등학교",
    "광주소프트웨어마이스터고등학교",
    "대구소프트웨어마이스터고등학교",
    "대덕소프트웨어마이스터고등학교",
    "대구소프트웨어마이스터고등학교",
    "광주소프트웨어마이스터고등학교"]

  school.push(school[Math.floor(Math.random() * 9)])

  try {
    const param = Joi.object({
      event: Joi.number().integer().min(1).max(10)
    })
    if (param.validate(req.body).error) {
      return res.status(400).send({
        msg: '유효하지 않은 이벤트 번호입니다.',
        msgId: 400
      });
    }

    const { event } = req.body;

    const isExistEvent = await user.findOne({
      where: {
        lucky_flag: {
          [Op.eq]: event
        }
      }
    })

    if (isExistEvent) return res.status(400).send({
      msg: '이미 해당 이벤트의 당첨자가 선정되었습니다',
      msgId: '400'
    })


    const luckyList = await user.findAll({
      order: fn('RAND'),
      where: {
        [Op.and]: [
          {
            school_name: {
              [Op.eq]: school[event - 1]
            }
          },
          {
            lucky_flag: {
              [Op.eq]: 0
            }
          },
          {
            login_flag: {
              [Op.eq]: 1
            }
          }
        ]
      },
      limit: 1
    })

    if (luckyList[0]) {
      const { id, school_name: schoolName, grade, class: _class, number, student_name: studentName } = luckyList[0].dataValues;

      await user.update({
        lucky_flag: event
      }, {
        where: {
          id
        }
      })
      io().emit('winner', {
        schoolName,
        grade,
        class: _class,
        number,
        studentName
      })
      return res.status(200).send({
        msg: '성공적으로 당첨자를 선정하였습니다.',
        msgId: 200
      })
    }
    else {
      return res.status(200).send({
        msg: '당첨 대상이 존재하지 않습니다.',
        msgId: 200
      })
    }
  }
  catch (error) {
    res.status(500).send({
      msg: "서버에서 오류가 발생하였습니다.",
      msgId: 500
    })
  }
}