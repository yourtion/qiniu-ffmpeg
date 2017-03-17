'use strict';

global.$ = {};

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = $.app = express();
const router = new express.Router();

app.use(router);

router.use((req, res, next) => {
  if(req.path === '/handler' && req.method === 'POST') {
    let length = req.headers['content-length'];
    console.log(JSON.stringify(req.headers));
    if(length == 0) return next();
    const filename = Math.random().toString(36).substr(2);
    const filepath = path.resolve('/tmp/', filename)
    const writerStream = fs.createWriteStream(filepath);
    writerStream.on('finish', next);
    req.on('data', (data) => {
      length -= data.length;
      writerStream.write(data);
    });
    req.on('end', (data) => {
      req.file = filepath;
      writerStream.end();
    });
  } else {
    next();
  }
})

router.use((req, res, next) => {
  res.error = (err, code) => {
    res.json({
      success: false,
      error_code: code || err.code || -1,
      message: err.message || err.toString(),
    });
  };
  res.success = (data) => {
    res.json({
      success: true,
      result: data || {},
      token: res.$newToken,
    });
  };
  next();
});
require('./api.js')(router);

router.use((err, req, res, next) => {
  console.log(err);
  res.error(err);
  next();
});

app.listen(9100, () => {
  // eslint-disable-next-line no-console
  console.log(`Qiniu-ffmpeg listening on 9100`);
});

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  process.exit(1);
});

