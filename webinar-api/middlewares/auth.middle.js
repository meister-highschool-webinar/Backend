const jwt = require('jsonwebtoken');
const { user } = require('../models');
const verifyJWT = (accessToken, salt) => new Promise((res, rej) => {
    jwt.verify(accessToken, salt, (err, decoded) => {
        if (err) rej(err);
        res(decoded);
    });
})

exports.verifyJWT = verifyJWT;
/**
 * @swagger
 * definitions:
 *   access-token:
 *     in: "header"
 *     name: "access-token"
 *     description: "사용자 access token을 입력 받습니다."
 *     required: true
 *     type: string
 *   refresh-token:
 *     in: "header"
 *     name: "refresh-token"
 *     description: "access token을 재발급 받기 위한 refresh token을 입력 받습니다."
 *     required: true
 *     type: string
 */

exports.userAuth = async(req, res, next) => {
    try {
        const token = req.headers['access-token'];
        const result = await user.findOne({
            where: {
                access_token: token
            },
            attributes: ['id']
        });
        if (!result) {
            res.status(401).json({
                msg: "인증에 실패하였습니다.",
                msgId: 401
            })
        }
        next()
    } catch (e) {
        res.status(401).json({
            msg: "인증에 실패하였습니다.",
            msgId: 401
        })
    }
}

/**
 * @swagger
 * definitions:
 *   x-access-token:
 *     in: "header"
 *     name: "x-access-token"
 *     description: "관리자인지 확인을 위한 토큰을 입력 받습니다."
 *     required: true
 *     type: string
 */

exports.adminAuth = async(req, res, next) => {
    try {
        const token = req.headers['x-access-token'] || req.query.token;
        await verifyJWT(token, process.env.JWT_ADMIN_SALT);
        next();
    } catch (e) {
        res.status(401).json({
            msg: "인증에 실패하였습니다.",
            msgId: 401
        })
    }
}