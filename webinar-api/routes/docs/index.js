let swaggerUi = require('swagger-ui-express');
let swaggerJSDoc = require('swagger-jsdoc');
let router = require('express').Router();

const ui_options = {
    validatorUrl: null,
    oauth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        appName: "webinar"
    }
};

const swaggerDefinition = {
    info: {
        title: 'Webinar API',
        version: '1.0.0',
        description: '마이스터고 웨비나의 개발에 사용될 API입니다.'
    },


    basePath: '/'
}

const options = {
    swaggerDefinition,
    apis: ['../**/index.js', 'models/**/*.js', '**/*.middle.js']
}

const specs = swaggerJSDoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(specs, false, ui_options));
// router.get('/', swaggerUi.setup(specs))

module.exports = router;