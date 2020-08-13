const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const router = require('express').Router();

const swaggerDefinition = {
  info: {
    title: 'Webinar API',
    version: '1.0.0',
    description: 'a'
  },
}

const options = {
  swaggerDefinition,
  apis: ['../**/index.js']
}

const specs = swaggerJSDoc(options);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs))

module.exports = router;