let swaggerUi = require('swagger-ui-express');
let swaggerJSDoc = require('swagger-jsdoc');
let router = require('express').Router();

const ui_options = {
    // validatorUrl: null,
    oauth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        appName: "webinar",
        scopes: 'profile email',
    }, // ui.initOAuth
    // authAction: {
    // }, // ui.authActions.authorize
};


const swaggerDefinition = {
    info: {
        title: 'Webinar API',
        version: '1.0.0',
        description: '마이스터고 웨비나의 개발에 사용될 API입니다.'
    },
    basePath: '/',
    openapi: '3.0.1',  // XXX: Bug from swagger-jsdoc @ https://github.com/Surnet/swagger-jsdoc/issues/141#issuecomment-456849354
    components: {
        securitySchemes: {
            google: {
                type: 'oauth2',
                flows: {
                    implict: {
                        authorizationUrl: "/auth/google",
                        scopes: {
                            profile: "profile",
                            email: "email",
                        }
                    }
                }
            }
        }
    },
    // security: [{
    //     google: []
    // }]
}

const options = {
    swaggerDefinition,
    apis: ['../**/index.js', 'models/**/*.js', '**/*.middle.js']
}

const specs = swaggerJSDoc(options);

router.use('/', swaggerUi.serve, swaggerUi.setup(specs, false, ui_options));

module.exports = router;