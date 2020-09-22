const jwt = require('jsonwebtoken');
const Joi = require('joi');

const { user } = require('../models');

exports.login = async function(req, res) {
  try {
    const param = Joi.object({
      schoolName: Joi.string().required(),
      grade: Joi.number().integer().required(),
      class: Joi.number().integer().required(),
      studentId: Joi.number().integer().required(),
      studentName: Joi.string().required(),
      number: Joi.number().integer().required(),
      code: Joi.string().length(6)
    });
    if(param.validate(req.body).error) {
      res.status(400).send({
        message: '공란이 존재합니다.'
      })
    }

    const { 
      schoolName: school_name,
      grade, 
      class: _class, 
      studentId: student_id, 
      studentName: student_name,
      number,
      code
    } = req.body;

    const result = await user.findOne({
      where: {
        school_name,
        grade,
        class: _class,
        number,
        student_id,
        student_name,
        code
      },
      attributes: ['school_name', 'id', 'student_id', 'student_name', 'number', 'login_flag']
    });

    if(result === null) return res.status(400).send({
      message: "유효하지 않은 사용자입니다."
    });

    const accessToken = jwt.sign({
      ...result.dataValues 
    }, process.env.JWT_SALT)
    
    const responseData = {
      accessToken,
      userId: result.dataValues.id,
      studentId: result.dataValues.student_id,
      studentName: result.dataValues.student_name,
      loginFlag: result.dataValues.login_flag
    }

    const startTime = new Date("2020-09-23 1:10:00 GMT+0900");
    const endTime = new Date("2020-09-23 1:13:00 GMT+0900");
    const currentTime = new Date();
    const currentTimeZone = currentTime.getTimezoneOffset();
    currentTime.setUTCMilliseconds(currentTime.getUTCMilliseconds() + ((currentTimeZone + 540) * 60 * 1000));

    if(startTime <= currentTime && currentTime <= endTime && responseData.loginFlag === 0) {
      await user.update({
        login_flag: 1
      }, {
        where: {
          id: responseData.userId
        }
      })
    }

    res.status(200).send(responseData)
  }
  catch(error) {
    console.log(error)
    res.status(500).send({
      message: "서버에서 오류가 발생하였습니다."
    })
  }
};

exports.adminLogin = (req, res) => {
  if (req.body.password !== process.env.access_token) {
    res.sendStatus(403);
    return;
  }

  const accessToken = jwt.sign({
    token: process.env.access_token
  }, process.env.JWT_ADMIN_SALT)

  const responseData = {
    accessToken
  }
  res.status(200).send(responseData)
}