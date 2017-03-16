'use strict';

const fs = require('fs');

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
    var stat = fs.statSync(file);
    var total = stat.size;
    res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
    fs.createReadStream(file).pipe(res);
  });

};
