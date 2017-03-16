'use strict';
const handler = require('./handler.js');

module.exports = function (router) {

  router.get('/', (req, res) => {
    res.success('Hello, QiNiu');
  });

  router.get('/health', function (req, res) {
    res.end('ok');
  });

  router.post('/handler', function (req, res) {
    handler(req, res);
  });

};
