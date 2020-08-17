const { Router } = require('express');

const auth = require('./auth');
const docs = require('./docs');

const { getTimetable } = require("../controllers/timetable.controller");
const {getWebinar} = require("../controllers/webinar.controller");

const router = Router();


/**
 * @swagger
 * tags:
 * - name: Webinar
 *   description: 웨비나 진행 관련 API
 */

router.use('/auth', auth)
router.use('/docs', docs)

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
 *        responses:
 *          200:
 *            description: "시간표"
 *            schema:
 *              $ref: "#/definitions/timetable_list"
 *          500:
 *            description: "DB 연결 에러"
 */
router.get('/timetable-list', getTimetable);

/**
 * @swagger
 *  paths:
 *    /webinar-info/{id}:
 *      get:
 *        tags:
 *        - "Webinar"
 *        summary: "웨비나 정보 조회"
 *        description: "웨비나 정보를 응답합니다."
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - name: id
 *          in: path
 *          description: 웨비나 고유 번호
 *          type: integer
 *          required: true
 *        responses:
 *          200:
 *            description: "웨비나 정보"
 *            schema:
 *              $ref: "#/definitions/webinar-item"
 *          404:
 *            description: "웨비나가 존재하지 않을 떄"
 */
router.get('/webinar-info/:id', getWebinar);

module.exports = router;
