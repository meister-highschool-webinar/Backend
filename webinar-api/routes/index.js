const { Router } = require('express');
const passport = require('passport');


const docs = require('./docs');
const auth = require('./auth');
const { getTimetable } = require("../controllers/timetable.controller");
const { googleLogin } = require("../controllers/login.controller");
const { getWebinar } = require("../controllers/webinar.controller");
const { qna } = require("../controllers/survey.controllers");
const { getWinnerList } = require('../controllers/luckdraw.controller');
const { userAuth } = require('../middlewares/auth.middle');
const router = Router();

// passport.serializeUser(async(user, done) => {
//     done(null, user);
// });

// passport.deserializeUser((user, done) => {
//     done(null, user);
// });

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `${process.env.SERVER_DOMAIN}/api/auth/google/callback`,
// }, googleLogin));

// // router.get('/verify/local', AuthHandler.verifyLocalLogin);

// // router.get('/verify/oauth', AuthHandler.verifyOauthLogin);
// router.use(passport.initialize());
// router.use(passport.session());


/**
 * @swagger
 * /auth/google:
 *    get:
 *      tags:
 *          - Login
 *      summary: google OAuth.
 *      description: redirect to google login
 */
// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));




/**
 * @swagger
 * /auth/logout:
 *    get:
 *      tags:
 *          - logout
 *      summary: logout.
 *      responses:
 *        200:
 *          description: '{ statusCode: string, errorMessage: string }'
 */
// router.get('/logout', AuthHandler.logout);

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


router.get('/get_auth_code', function(req, res) {



    var s_html = '<html>';

    s_html += '<head></head>';

    s_html += '<body>';

    s_html += '<a href="https://accounts.google.com/o/oauth2/auth?' +

        'client_id=' + CLIENT_ID +

        '&redirect_uri=' + REDIRECT_URI +

        '&scope=https://www.googleapis.com/auth/plus.login' +

        '&response_type=code">로그인</a>';

    s_html += "</body>";

    s_html += "</html>";



    res.send(s_html);

});

router.get('/oauth2callback', function(req, res) {



    if (typeof req.query.code != 'undefined')

    {

        console.log("authorization code = " + req.query.code);

        res.send("authorization code = " + req.query.code);

    } else if (typeof req.query.access_token != 'undefined')

    {

        console.log("access_token = " + req.query.access_token);

        res.send("access_token = " + req.query.access_token);

    } else if (typeof req.query.user_id != 'undefined')

    {

        console.log("user_id = " + req.query.user_id);

        res.send("user_id = " + req.query.user_id);

    }

});

module.exports = router;