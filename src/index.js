'use strict';

global.$ = {};

const express = require('express');
const fs = require('fs');
const app = $.app = express();
const router = new express.Router();

app.use(router);

router.use((req, res, next) => {
  if(req.path === '/handler' && req.method === 'POST') {
    let length = req.headers['content-length'];
    if(length === 0) next();
    const filename = Math.random().toString(36).substr(2);
    const writerStream = fs.createWriteStream(filename);
    writerStream.on('finish', next);
    req.on('data', (data) => {
      length -= data.length;
      writerStream.write(data);
    });
    req.on('end', (data) => {
      req.file = filename;
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

