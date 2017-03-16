'use strict';

const fs = require('fs');
var http = require('http');

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
    if(url) {
      const filename = Math.random().toString(36).substr(2);
      const video = path.resolve('/tmp/', filename)
      const request = http.get(url, (response) => {
        response.pipe(video);
        video.on('finish', () => {
          video.close(() => {
            const stat = fs.statSync(video);
            const total = stat.size;
            res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
            fs.createReadStream(video).pipe(res);
          });
        });
      });
      
    } else {
      const stat = fs.statSync(file);
      const total = stat.size;
      res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
      fs.createReadStream(file).pipe(res);
    }

  });

};
