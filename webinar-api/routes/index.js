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
 *   webinar-item:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *         description: 웨비나 타이틀
 *       link:
 *         type: string
 *         format: uri
 *         description: 웨비나 유튜브 링크
 *       detail:
 *         type: string
 *         description: 웨비나 소개
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
