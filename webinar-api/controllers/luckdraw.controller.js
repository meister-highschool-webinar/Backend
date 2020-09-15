const { fn, Op } = require('sequelize');
const { io } = require('../modules/websocket');
const Joi = require('joi');

const { user } = require('../models');

const range = event => {
  if(event >= 1 && event <= 6) return [1, 6, 2];
  else if(event >= 7 && event <= 9) return [7, 9, 1];
  else return [10, 10, 1];
}

exports.getWinnerList = async (req, res) => {
  try {
    const winnerList = Array(10).fill({})
    const winnersInfo = await user.findAll({
      order: [ [ 'lucky_flag', 'ASC' ]],
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
    const [min, max, limit] = range(event);

    const targetSchool = new Set(['대덕소프트웨어마이스터고등학교', '광주소프트웨어마이스터고등학교', '대구소프트웨어마이스터고등학교']);

    const isExistEvent = await user.findOne({
      where: {
        lucky_flag: {
          [Op.eq]: event
        }
      }
    })

    if(isExistEvent) return res.status(400).send({
      msg: '이미 해당 이벤트의 당첨자가 선정되었습니다',
      msgId: '400'
    })

    const WinnerSchool = await user.findAll({
      where: {
        lucky_flag: { 
          [Op.gte]: min,
          [Op.lte]: max
        }
      },
      attributes: ['school_name', [
        fn('count', '*'),
        'count'
      ]],
      group: 'school_name'
    })

    WinnerSchool.forEach(schoolInfo => {
      const { count, school_name } = schoolInfo.dataValues;
      if(count >= limit) {
        if(event === 10) targetSchool.clear();
        else targetSchool.delete(school_name);
      }
    });
  
    if(targetSchool.size) {
      const luckyList = await user.findAll({
        order: fn('RAND'),
        where: {
          [Op.and]: [
            {
              school_name: {
                [Op.or]: [...targetSchool]
              }
            },
            {
              lucky_flag: { 
                [Op.eq]: 0
              }
            }
          ]
        },
        limit: 1
      })
    
      if(luckyList) {
        const { id, school_name, grade, class: _class, number, student_name } = luckyList[0].dataValues;

        await user.update({
          lucky_flag: event
        }, {
          where: {
            id
          }
        })
        io().emit('winner', {
          lucky_flag: event,
          school_name,
          grade,
          class: _class,
          number,
          student_name
        })
        return res.status(200).send({
          msg: '성공적으로 당첨자를 선정하였습니다.',
          msgId: 200
        })
      }    
    }
    else {
      return res.status(400).send({
        msg: '해당 이벤트 상품의 잔량이 모두 소진되었습니다.',
        msgId: 400
      })
    }
  }
  catch(error) {
    res.status(500).send({
      msg: "서버에서 오류가 발생하였습니다.",
      msgId: 500
    })
  }
}