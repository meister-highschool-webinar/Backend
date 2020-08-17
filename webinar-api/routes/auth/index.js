const { Router } = require('express');

const { login } = require('../../controllers/login.controller');
const { inputTimetable } = require('../../controllers/timetable.controller');

const { auth } = require('../../middlewares/auth.middle');

const router = Router();

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
 *       - number
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
 *       number:
 *         type: integer
 *         description: 번호
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

 router.post('/login', login);

/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: 웨비나 시간표 입력
 * definitions:
 *   timetable_list:
 *     type: array
 *     items:
 *       $ref: '#/definitions/timetable_item'
 *   timetable_item:
 *     type: object
 *     properties:
 *       track_name:
 *         type: string
 *         description: 트랙 이름
 *       speech:
 *         type: string
 *         description: 발표자
 *       start_time:
 *         type: string
 *         format: date-time
 *         description: 트랙 시작 시간
 *       end_time:
 *         type: string
 *         format: date-time
 *         description: 트랙 종료 시간
 */

/**
 * @swagger
 *  paths:
 *    /auth/timetable:
 *      post:
 *        tags:
 *        - "Timetable"
 *        summary: "웨비나 시간표 입력"
 *        description: "웨비나 시간표 를 입력합니다."
 *        produces:
 *        - "application/json"
  *       parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "로그인을 위해 학교, 학생의 인적사항을 전달"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/auth_request" 
 *        responses:
 *          200:
 *            description: "입력 성공"
 *            schema:
 *              $ref: "#/definitions/timetable_input"
 *          400:
 *            description: "입력 실패"
 *          401:
 *            description: "인증 에러"
 */

 router.use(auth)
      .post('/timetable', inputTimetable);

 module.exports = router