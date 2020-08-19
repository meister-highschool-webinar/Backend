const { startLuckdraw } = require('../../../controllers/luckdraw.controller');

const router = require('express').Router();

/**
 * @swagger
 * definitions:
 *   luckdraw_start_request:
 *     type: object
 *     properties:
 *       event: 
 *         type: integer
 *         description: 이벤트 타입
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

module.exports = router;