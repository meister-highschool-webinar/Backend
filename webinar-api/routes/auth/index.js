const { Router } = require('express');

const { login, adminLogin, logout } = require('../../controllers/login.controller');
const { signup } = require("../../controllers/signup.controller")
const { refresh, me } = require("../../controllers/refresh.controller")
const { inputTimetable } = require('../../controllers/timetable.controller');
const { newWebinar } = require("../../controllers/webinar.controller");
const { deleteUser, getUsertable } = require("../../controllers/user.controller");
const { removeAllChat, removeAllQnaChat, refreshPage, getAllChat } = require("../../controllers/chat.controller");
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
 * @openapi
 *  paths:
 *    /api/auth/admin-login:
 *      post:
 *        tags:
 *        - "Auth"
 *        summary: "관리자 로그인"
 *        requestBody:
 *          description: "관리자 토큰을 사용해 로그인 합니다."
 *          content:
 *            application/json:
 *              schema:
 *                description: 로그인 결과
 *                type: object
 *                properties:
 *                  password:
 *                    type: string
 *                    format: uuid
 *          required: true
 *        responses:
 *          200:
 *            description: "로그인 결과"
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  accessToken:
 *                  type: string
 *                  description: 발급된 access tokene'
 *          403:
 *            description: "잘못된 토큰"
 *          x-codegen-request-body-name: body
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
 *            enum: [timetable, chatlog, user, question]
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
 *        tags:
 *        - "Auth"
 *        summary: "Signup"
 *        requestBody:
 *          description: 로그인을 위해 이메일과 비밀번호 전달
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/signup_request'
 *          required: true
 *        responses:
 *          200:
 *            description: 로그인 결과
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/signup_request'
 *          400:
 *            description: 잘못된 데이터
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/signup_request'
 *          security:
 *            - google:
 *              - profile
 *              - email
 *          x-codegen-request-body-name: body
 * components:
 *   schemas:
 *      signup_request:
 *       type: object
 *       properties:
 *         schoolCode:
 *           type: string
 *           description: 학교 코드
 *         grade:
 *           type: integer
 *           description: 학년
 *         class:
 *           type: integer
 *           description: 반
 *         number:
 *           type: integer
 *           description: 번호
 *         studentName:
 *           type: string
 *           description: 학생명
 *         email:
 *           type: string
 *           description: 이메일
 */
router.post('/signup', signup);



/**
 * @swagger
 *  paths:
 *    /api/auth/users:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 유저 전체 조회"
 *        description: "웨비나 유저 전체 조회합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        - in: "query"
 *          name: "pageSize"
 *          description: "가져올 페이지 사이즈"
 *          schema:
 *            type: int
 *        - in: "query"
 *          name: "pageNum"
 *          description: "가져올 페이지 넘버"
 *          schema:
 *            type: int
 *        responses:
 *          200:
 *            description: "웨비나 유저 전체 조회"
 *            schema:
 *              $ref: "#/definitions/webinar-item"
 *          400:
 *            description: "잘못된 데이터"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 *          500:
 *            description: "DB 연결 에러"
 */
router.get('/users', adminAuth, getUsertable);



/**
 * @swagger
 *  paths:
 *    /api/auth/remove_all_chat:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 유저 전체 채팅 삭제 요청"
 *        description: "웨비나 유저 전체 채팅 삭제 요청합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        responses:
 *          200:
 *            description: "웨비나 유저 전체 채팅 삭제 요청"
 *          500:
 *            description: "소켓 연결 에러"
 */
router.get('/remove_all_chat', adminAuth, removeAllChat);

/**
 * @swagger
 *  paths:
 *    /api/auth/remove_all_qna:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 유저 전체 질문 채팅 삭제 요청"
 *        description: "웨비나 유저 질문 전체 채팅 삭제 요청합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        responses:
 *          200:
 *            description: "웨비나 유저 전체 질문 채팅 삭제 요청"
 *          500:
 *            description: "소켓 연결 에러"
 */
router.get('/remove_all_qna', adminAuth, removeAllQnaChat);


/**
 * @swagger
 *  paths:
 *    /api/auth/refresh_page:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 강제 새로고침 요청"
 *        description: "웨비나 강제 새로고침 요청합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        responses:
 *          200:
 *            description: "웨비나 유저 전체 질문 채팅 삭제 요청"
 *          500:
 *            description: "소켓 연결 에러"
 */
router.get('/refresh_page', adminAuth, refreshPage);



/**
 * @swagger
 *  paths:
 *    /api/auth/user:
 *      delete:
 *        tags:
 *        - "Webinar"
 *        summary: "유저 삭제"
 *        description: "유저 삭제합니다"
 *        parameters:
 *          - $ref: "#/definitions/x-access-token"
 *        requestBody:
 *          description: "email을 사용하여 유저 삭제합니다"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *          required: true
 *        responses:
 *          200:
 *            description: "이메일 삭제 여부"
 *            schema:
 *              $ref: "#/definitions/Response_success"
 *          400:
 *            description: "잘못된 데이터"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 *          500:
 *            description: "DB 연결 에러"
 */
router.delete('/user', adminAuth, deleteUser);

module.exports = router;