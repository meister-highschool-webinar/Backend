let express = require('express');

const { login, newWebinar } = require("../../controllers/auth.controller");

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
 *  paths:
 *    /auth/webinar:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 정보 생성"
 *        description: "새로운 웨비나 정보를 DB에 삽입합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - name: body
 *          in: body
 *          description: 웨비나 정보
 *          schema:
 *              $ref: "#/definitions/webinar-item"
 *        responses:
 *          201:
 *            description: "웨비나 정보"
 *            schema:
 *              $ref: "#/definitions/webinar-item"
 *          400:
 *            description: "입력 정보에 오류가 있을 때"
 *          500:
 *            description: "500 DB 연결 오류"
 */
router.post('/webinar', newWebinar);

module.exports = router;
