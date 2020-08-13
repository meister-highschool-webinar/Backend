let express = require('express');
let db = require('../../models/index');
let jwt = require('jsonwebtoken');
let router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 로그인 처리
 * definitions:
 *   auth_request:
 *     type: object
 *     required:
 *       - schoolName
 *       - grade
 *       - class
 *       - studentId
 *       - studentName
 *     properties:
 *       schoolName:
 *         type: string
 *         description: 학교 이름
 *       grade:
 *         type: integer
 *         description: 학년
 *       class:
 *         type: integer
 *         description: 반
 *       studentId:
 *         type: integer
 *         description: 학생 번호
 *       studentName:
 *         type: string
 *         description: 학생 이름
 *   auth_response:
 *     type: object
 *     required:
 *       - accessToken
 *       - userId
 *       - studentId
 *       - studentName
 *     properties:
 *       accessToken:
 *         type: string
 *         description: 발급된 access token
 *       userId:
 *         type: integer
 *         description: 유저 id
 *       studentId:
 *         type: integer
 *         description: 학생 번호
 *       studentName:
 *         type: string
 *         description: 학생 이름
 *   Response_error:
 *     type: object
 *     required:
 *       - status
 *     properties:
 *       message:
 *         type: string
 *         description: 오류 사유
 */

/**
 * @swagger
 *  paths:
 *    /auth/login:
 *      post:
 *        tags:
 *        - "Auth"
 *        summary: "Login"
 *        description: ""
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "로그인을 위해 학교, 학생의 인적사항을 전달"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/auth_request"
 *        responses:
 *          200:
 *            description: "로그인 결과"
 *            schema:
 *              $ref: "#/definitions/auth_response"
 *          401:
 *            description: "잘못된 데이터"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 */

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
        number,
        student_id,
        student_name
      },
      attributes: ['school_name', 'id', 'student_id', 'student_name', 'number']
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
