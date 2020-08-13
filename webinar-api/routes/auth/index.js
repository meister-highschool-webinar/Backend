const express = require('express');
const db = require('../../models/index');
const jwt = require('jsonwebtoken');
const router = express.Router();

/* GET home page. */
router.post('/login', async function(req, res, next) {
  const { 
    schoolName: school_name = "", 
    grade = 0, 
    class: _class = 0, 
    studentId: student_id = 0, 
    studentName: student_name = ""
  } = req.body;

  try {
    const result = await db.user.findOne({
      where: {
        school_name,
        grade,
        class: _class,
        student_id,
        student_name
      },
      attributes: ['school_name', 'id', 'student_id', 'student_name']
    });

    if(result === null) throw new Error("공란이 존재하거나 유효하지 않은 사용자 정보입니다.");

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
    res.status(401).send({
      message: error.message
    })
  }
});

module.exports = router;
