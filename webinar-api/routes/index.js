const { Router } = require('express');

const auth = require('./auth');
const docs = require('./docs');

const { getTimetable } = require("../controllers/timetable.controller");

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Timetable
 *   description: 웨비나 시간표
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

router.use('/auth', auth)
router.use('/docs', docs)

/**
 * @swagger
 *  paths:
 *    /timetable-list:
 *      get:
 *        tags:
 *        - "Timetable"
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

module.exports = router;
