const { Router } = require('express');
const passport = require('passport');


const docs = require('./docs');
const auth = require('./auth');
const { getTimetable } = require("../controllers/timetable.controller");
const { googleLogin } = require("../controllers/login.controller");
const { getWebinar } = require("../controllers/webinar.controller");
const { getUserInfo } = require("../controllers/user.controller");
const { getAllChat } = require("../controllers/chat.controller");

const { qna } = require("../controllers/survey.controllers");
const { getWinnerList } = require('../controllers/luckdraw.controller');
const { authenticateUser } = require('../middlewares/auth.middle');
const router = Router();

/**
 * @swagger
 *  paths:
 *    /auth/logout:
 *      get:
 *        tags:
 *        - "logout"
 *        responses:
 *          200:
 *            description: '{ statusCode: string, errorMessage: string }'
 *          security:
 *            - google:
 *              - profile
 *              - email
 */



/**
 * @swagger
 * tags:
 * - name: Webinar
 *   description: 웨비나 진행 관련 API
 */

/**
 * @swagger
 *  paths:
 *    /api/timetable-list:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 시간표 조회"
 *        description: "웨비나 시간표 목록을 가져옵니다."
 *        produces:
 *        - "application/json"
 *        responses:
 *          200:
 *            description: "시간표"
 *            schema:
 *              $ref: "#/definitions/timetable_list"
 *          400:
 *            description: "응답에러"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 *          500:
 *            description: "DB 연결 에러"
 */
router.use('/auth', auth);
router.use('/docs', docs);
router.get('/timetable-list', getTimetable);

/**
 * @swagger
 *  paths:
 *    /api/webinar-info:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 정보 조회"
 *        description: "웨비나 정보를 응답합니다."
 *        produces:
 *        - "application/json"
 *        responses:
 *          200:
 *            description: "웨비나 정보"
 *            schema:
 *              $ref: "#/definitions/webinar-item"
 *          400:
 *            description: "잘못된 데이터"
 *            schema:
 *              $ref: "#/definitions/Response_error"
 *          500:
 *            description: "DB 연결 에러"
 */
router.get('/webinar-info', getWebinar);

/** 
 * @swagger
 *  paths:
 *    /api/qna:
 *      get:
 *        tags:
 *        - "Survey"
 *        summary: "설문 결과 조회"
 *        description: "설문 결과를 조회합니다."
 *        produces:
 *        - "application/json"
 *        responses:
 *          200:
 *            description: "시간표"
 *            schema:
 *              $ref: "#/definitions/qna_response"
 *          500:
 *            description: "DB 연결 에러"
 */

router.get('/qna', qna);

/**
 * @swagger
 *  paths:
 *    /api/winner:
 *      get:
 *        tags:
 *        - "Winner"
 *        summary: "럭키드로우 전체 결과 조회"
 *        description: "럭키드로우 전체 결과를 조회합니다."
 *        produces:
 *        - "application/json"
 *        responses:
 *          200:
 *            description: "결과"
 *            schema:
 *              $ref: "#/definitions/winner"
 *          500:
 *            description: "DB 연결 에러"
 */

router.get('/winner', getWinnerList);


/**
 * @swagger
 *  paths:
 *    /api/user-info:
 *      post:
 *        tags:
 *        - "Webinar"
 *        summary: "user info 구글 세션 필요"
 *        responses:
 *          200:
 *            description: 로그인 결과
 *          400:
 *            description: 잘못된 데이터
 *            application/json:
 *          security:
 *            - google:
 *              - profile
 *              - email
 *          x-codegen-request-body-name: body
 */
router.post('/user-info', getUserInfo);

/**
 * @swagger
 *  paths:
 *    /api/get_all_chat:
 *      get:
 *        tags:
 *        - "get_all_chat"
 *        summary: "user info 구글 세션 필요"
 *        responses:
 *          200:
 *            description: 로그인 결과
 *          400:
 *            description: 잘못된 데이터
 *            application/json:
 *          security:
 *            - google:
 *              - profile
 *              - email
 *          x-codegen-request-body-name: body
 */
router.get('/get_all_chat', getAllChat);

module.exports = router;