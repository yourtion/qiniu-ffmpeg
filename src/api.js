'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function (router) {

  router.get('/', (req, res) => {
    res.success('Hello, QiNiu');
  });

  router.get('/health', function (req, res) {
    res.end('ok');
  });

  router.post('/handler', function (req, res) {
    console.log(req.file);
    const cmd = req.query.cmd;
    const url = req.query.url;
    const file = req.file;
    if(!cmd) return res.error('cmd');
    if(!file && !url) return res.error('file');
    res.success({cmd, file, url});
  });

};
