const { fn, Op } = require('sequelize');
const Joi = require('joi');

const { user } = require('../models');

exports.startLuckdraw = async (req, res) => {
  try {
    const param = Joi.object({
      event: Joi.number().integer().min(1).max(3)
    })
    if (param.validate(req.body).error) {
      return res.status(400).send({
        msg: '유효하지 않은 이벤트 번호입니다.',
        msgId: 400
      });
    }

    const { event } = req.body;
    const targetSchool = new Set(['대덕소프트웨어마이스터고등학교', '광주소프트웨어마이스터고등학교', '대구소프트웨어마이스터고등학교']);
    const schoolWinners = {
      '대덕소프트웨어마이스터고등학교': 0,
      '광주소프트웨어마이스터고등학교': 0,
      '대구소프트웨어마이스터고등학교': 0 
    }
    const eventLimit = {
      1: 2,
      2: 1,
      3: 1
    }

    const WinnerList = await user.findAll({
      where: {
        lucky_flag: { 
          [Op.eq]: event
        }
      }
    })
  
    WinnerList.forEach(userInfo => {
      schoolWinners[userInfo.dataValues.school_name]++;
    })
    targetSchool.forEach(schoolName => {
      if(schoolWinners[schoolName] >= eventLimit[event]) {
        targetSchool.delete(schoolName)
        if(event === 3) targetSchool.clear();
      }
    })
  
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
        await user.update({
          lucky_flag: event
        }, {
          where: {
            id: luckyList[0].dataValues.id
          }
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