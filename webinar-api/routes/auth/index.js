const { Router } = require('express');

const { login, adminLogin, logout } = require('../../controllers/login.controller');
const { signup } = require("../../controllers/signup.controller")
const { refresh, me } = require("../../controllers/refresh.controller")
const { inputTimetable } = require('../../controllers/timetable.controller');
const { newWebinar } = require("../../controllers/webinar.controller");

const { adminAuth } = require('../../middlewares/auth.middle');

const luckdraw = require("./luckdraw");
const { exportToFile } = require("../../controllers/file.controller");

const router = Router();

router.use('/luckdraw', adminAuth, luckdraw);


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 로그인 처리
 * definitions:
 *   qna_response:
 *     type: object
 *     require:
 *       - qna
 *     properties:
 *       qna:
 *         type: object
 *         description: 설문 조사 결과 리스트
 *         properties:
 *           school:
 *             type: array
 *             items:
 *               $ref: '#/definitions/qna_item'
 *           grade:
 *             type: array
 *             items:
 *               $ref: '#/definitions/qna_item'
 *           major:
 *             type: array
 *             items:
 *               $ref: '#/definitions/qna_item'
 *           info:
 *             type: array
 *             items:
 *               $ref: '#/definitions/qna_item'
 *           language:
 *             type: array
 *             items:
 *               $ref: '#/definitions/qna_item'
 *           field:
 *             type: array
 *             items:
 *               $ref: '#/definitions/qna_item'
 *           company:
 *             type: array
 *             items:
 *               $ref: '#/definitions/qna_item'
 *   qna_item:
 *     type: object
 *     require:
 *       - name
 *       - count
 *     properties:
 *       name:
 *         type: string
 *         description: 요소 이름
 *       count:
 *         type: integer
 *         description: 요소 개수
 *   auth:
 *     type: string
 *     require:
 *       - x-access-token
 *     properties:
 *       x-access-token:
 *         type: string
 *         description: access token
 *   timetable_input_request:
 *     type: object
 *     require:
 *       - tableList
 *     properties:
 *       tableList:
 *         type: array
 *         description: 시간표 리스트
 *         items: 
 *           $ref: '#/definitions/timetable_item'
 *   timetable_input_response:
 *     type: object
 *     require:
 *       - msg
 *       - msgId
 *     properties:
 *       msg:
 *         type: string
 *         description: "처리 메시지"
 *       msgId:
 *         type: number
 *         description: "처리 id"
 *   signup_request:
 *     type: object
 *     required:
 *       - schoolCode
 *       - grade
 *       - class
 *       - number
 *       - email
 *       - studentName
 *     properties:
 *       schoolCode:
 *         type: string
 *         description: 학교 코드
 *       studentName:
 *         type: string
 *         description: 학생 이름
 *       grade:
 *         type: integer
 *         description: 학년
 *       class:
 *         type: integer
 *         description: 반
 *       number:
 *         type: integer
 *         description: 번호
 *       email:
 *         type: string
 *         description: 이메일
 *   auth_request:
 *     type: object
 *     required:
 *       - email
 *       - password
 *     properties:
 *       email:
 *         type: string
 *         description: 이메일
 *       password:
 *         type: string
 *         description: 비밀번호
 *   me_request:
 *     type: object
 *     required:
 *       - email
 *     properties:
 *       email:
 *         type: string
 *         description: 이메일
 *   auth_response:
 *     type: object
 *     required:
 *       - accessToken
 *       - userId
 *       - refreshToken
 *       - studentName
 *     properties:
 *       accessToken:
 *         type: string
 *         description: 발급된 access token
 *       refreshToken:
 *         type: string
 *         description: 발급된 refresh token
 *       userId:
 *         type: integer
 *         description: 유저 id
 *       studentName:
 *         type: string
 *         description: 학생 이름
 *   refresh_response:
 *     type: object
 *     required:
 *       - accessToken
 *       - userId
 *       - studentName
 *     properties:
 *       accessToken:
 *         type: string
 *         description: 발급된 access token
 *       userId:
 *         type: integer
 *         description: 유저 id
 *       studentName:
 *         type: string
 *         description: 학생 이름
 *   Response_success:
 *     type: object
 *     required:
 *       - status
 *     properties:
 *       message:
 *         type: string
 *         description: 성공
 *   Response_error:
 *     type: object
 *     required:
 *       - status
 *     properties:
 *       message:
 *         type: string
 *         description: 오류 사유
 *   admin_auth_response:
 *     type: object
 *     properties:
 *       accessToken:
 *         type: string
 *         description: 발급된 access token
 */


/**
 * @swagger
 *  paths:
 *    /api/auth/admin-login:
 *      post:
 *        tags:
 *        - "Auth"
 *        summary: "관리자 로그인"
 *        description: "관리자 토큰을 사용해 로그인 합니다."
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "관리자 토큰"
 *          required: true
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                format: uuid
 *        responses:
 *          200:
 *            description: "로그인 결과"
 *            schema:
 *              $ref: "#/definitions/admin_auth_response"
 *          403:
 *            description: "잘못된 토큰"
 */
router.post('/admin-login', adminLogin);

/**
 * @swagger
 *  paths:
 *    /api/auth/webinar:
 *      post:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 정보 생성"
 *        description: "새로운 웨비나 정보를 DB에 삽입합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
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
router.post('/webinar', adminAuth, newWebinar);

/**
 * @swagger
 *  paths:
 *    /api/auth/timetable:
 *      post:
 *        tags:
 *        - "Timetable"
 *        summary: "웨비나 시간표 입력"
 *        description: "웨비나 시간표를 입력합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        - in: "body"
 *          name: "body"
 *          description: "타임 테이블 입력을 위한 정보를 받습니다."
 *          required: true
 *          schema:
 *            $ref: "#/definitions/timetable_input_request" 
 *        responses:
 *          200:
 *            description: "입력 성공"
 *            schema:
 *              $ref: "#/definitions/timetable_input_response"
 *          400:
 *            description: "입력 실패"
 *            schema:
 *              $ref: "#/definitions/timetable_input_response"
 *          401:
 *            description: "인증 에러"
 *            schema:
 *              $ref: "#/definitions/timetable_input_response"
 *          500:
 *            description: "서버 에러"
 */
router.post('/timetable', adminAuth, inputTimetable);

/**
 * @swagger
 *  paths:
 *    /api/auth/file-download:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 데이터 다운로드"
 *        description: "웨비나 데이터를 csv로 다운로드합니다."
 *        produces:
 *        - "text/csv"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        - in: "query"
 *          name: "dataName"
 *          description: "가져올 데이터 종류"
 *          required: true
 *          schema:
 *            type: string
 *            enum: [timetable, chatlog]
 *        responses:
 *          200:
 *            description: "export 성공"
 *          404:
 *            description: "없는 데이터"
 */
router.get('/file-download', adminAuth, exportToFile);


/**
 * @swagger
 *  paths:
 *    /api/auth/signup:
 *      post:
 *        security:
 *        - google: [profile, email]
 *        tags:
 *        - "Auth"
 *        summary: "Signup"
 *        description: ""
 *        consumes:
 *        - "application/json"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - in: "body"
 *          name: "body"
 *          description: "로그인을 위해 이메일과 비밀번호 전달"
 *          required: true
 *          schema:
 *            $ref: "#/definitions/signup_request"
 *        responses:
 *          200:
 *            description: "로그인 결과"
 *            schema:
 *              $ref: "#/definitions/auth_response"
 *          400:
 *            description: "잘못된 데이터"
 *            schema:
 *              $ref: "#/definitions/Response_success"
 */
router.post('/signup', signup);


module.exports = router;