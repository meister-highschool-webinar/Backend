const { startLuckdraw, resetWinnerList } = require('../../../controllers/luckdraw.controller');

const router = require('express').Router();

/**
 * @swagger
 * definitions:
 *   winner_data:
 *     type: object
 *     properties:
 *       school_name:
 *         type: string
 *         description: 학교명
 *       grade:
 *         type: integer
 *         description: 학년
 *       class:
 *         type: integer
 *         description: 반
 *       number:
 *         type: integer
 *         description: 번호
 *       student_name:
 *         type: string
 *         description: 학생명
 *       lucky_flag:
 *         type: integer
 *         description: 당첨 이벤트 번호
 *   winner:
 *     type: array
 *     items:
 *       $ref: "#/definitions/winner_data"
 *   luckdraw_start_request:
 *     type: object
 *     properties:
 *       event: 
 *         type: integer
 *         description: 1 ~ 6일반 경품 분배, 7 ~ 9좋은 경품 분배, 10 학교 통합 랜덤 좋은 경품
 *   luckdraw_start_response:
 *     type: object
 *     properties:
 *       msg: 
 *         type: string
 *         description: 처리 메시지
 *       msgId: 
 *         type: integer
 *         description: 처리 id
 */

/**
 * @swagger
 *  paths:
 *    /auth/luckdraw/reset:
 *      patch:
 *        tags:
 *        - "Luckdraw"
 *        summary: "럭키 드로우 초기화"
 *        description: "럭키 드로우 당첨자를 초기화합니다"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        responses:
 *          200:
 *            description: "당첨자 선정 성공"
 *            schema:
 *              $ref: "#/definitions/luckdraw_start_response"
 *          401:
 *            description: "인증 에러"
 *            schema:
 *              $ref: "#/definitions/luckdraw_start_response"
 *          500:
 *            description: "서버 에러"
 *            schema:
 *              $ref: "#/definitions/luckdraw_start_response"      
 *    /auth/luckdraw/start:
 *      post:
 *        tags:
 *        - "Luckdraw"
 *        summary: "럭키 드로우 시작"
 *        description: "럭키 드로우를 시작합니다"
 *        produces:
 *        - "application/json"
 *        parameters:
 *        - $ref: "#/definitions/x-access-token"
 *        - in: "body"
 *          name: "body"
 *          description: "럭키 드로우를 시작하기 위한 정보를 받습니다."
 *          required: true
 *          schema:
 *            $ref: "#/definitions/luckdraw_start_request" 
 *        responses:
 *          200:
 *            description: "당첨자 선정 성공"
 *            schema:
 *              $ref: "#/definitions/luckdraw_start_response"
 *          400:
 *            description: "해당 이벤트 상품 소진"
 *            schema:
 *              $ref: "#/definitions/luckdraw_start_response"
 *          401:
 *            description: "인증 에러"
 *            schema:
 *              $ref: "#/definitions/luckdraw_start_response"
 *          500:
 *            description: "서버 에러"
 *            schema:
 *              $ref: "#/definitions/luckdraw_start_response"
 */

router.post('/start', startLuckdraw);
router.patch('/reset', resetWinnerList);

module.exports = router;