let { user } = require('../models');
let jwt = require('jsonwebtoken');

exports.login = async function(req, res, next) {
  const { 
    schoolName: school_name = "", 
    grade = 0, 
    class: _class = 0, 
    studentId: student_id = 0, 
    studentName: student_name = "",
    number = 0
  } = req.body;

  try {
    const result = await user.findOne({
      where: {
        school_name,
        grade,
        class: _class,
        number,
        student_id,
        student_name
      },
      attributes: ['school_name', 'id', 'student_id', 'student_name', 'number']
    });

    if(result === null) return res.status(400).send({
      message: "공백이거나, 유효하지 않는 사용자입니다."
    });

    const accessToken = jwt.sign({
      ...result.dataValues 
    }, process.env.JWT_SALT)
    
    const responseData = {
      accessToken,
      userId: result.dataValues.id,
      studentId: result.dataValues.student_id,
      studentName: result.dataValues.student_name,
    }
    res.status(200).send(responseData)
  }
  catch(error) {
    res.status(500).send({
      message: "서버에서 오류가 발생하였습니다."
    })
  }
}