let swaggerUi = require('swagger-ui-express');
let swaggerJSDoc = require('swagger-jsdoc');
let router = require('express').Router();

const swaggerDefinition = {
  info: {
    title: 'Webinar API',
    version: '1.0.0',
    description: '마이스터고 웨비나의 개발에 사용될 API입니다.'
  },
  basePath: '/api'
}

const options = {
  swaggerDefinition,
  apis: ['../**/index.js']
}

const specs = swaggerJSDoc(options);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs))

module.exports = router;