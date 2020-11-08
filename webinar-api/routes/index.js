const { Router } = require('express');

const docs = require('./docs');
const auth = require('./auth');

const { getTimetable } = require("../controllers/timetable.controller");
const { getWebinar } = require("../controllers/webinar.controller");
const { qna } = require("../controllers/survey.controllers");
const { getWinnerList } = require('../controllers/luckdraw.controller');
const { userAuth } = require('../middlewares/auth.middle');
const router = Router();

/**
 * @swagger
 * tags:
 * - name: Webinar
 *   description: 웨비나 진행 관련 API
 */

/**
 * @swagger
 *  paths:
 *    /timetable-list:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 시간표 조회"
 *        description: "웨비나 시간표 목록을 가져옵니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/access-token"
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
router.get('/timetable-list', userAuth, getTimetable);

/**
 * @swagger
 *  paths:
 *    /webinar-info:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 정보 조회"
 *        description: "웨비나 정보를 응답합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/access-token"
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
router.get('/webinar-info', userAuth, getWebinar);

/**
 * @swagger
 *  paths:
 *    /qna:
 *      get:
 *        tags:
 *        - "Survey"
 *        summary: "설문 결과 조회"
 *        description: "설문 결과를 조회합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/access-token"
 *        responses:
 *          200:
 *            description: "시간표"
 *            schema:
 *              $ref: "#/definitions/qna_response"
 *          500:
 *            description: "DB 연결 에러"
 */

router.get('/qna', userAuth, qna);

/**
 * @swagger
 *  paths:
 *    /winner:
 *      get:
 *        tags:
 *        - "Winner"
 *        summary: "럭키드로우 전체 결과 조회"
 *        description: "럭키드로우 전체 결과를 조회합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/access-token"
 *        responses:
 *          200:
 *            description: "결과"
 *            schema:
 *              $ref: "#/definitions/winner"
 *          500:
 *            description: "DB 연결 에러"
 */

router.get('/winner', userAuth, getWinnerList);

module.exports = router;