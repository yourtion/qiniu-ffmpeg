const fs = require('fs');
const http = require('http');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

module.exports = function(req, res) {
  const cmd = req.query.cmd;
  const url = req.query.url;
  const file = req.file;
  const startTime = Date.now();
  if(!cmd) return res.error('cmd');
  if(!file && !url) return res.error('file');
  const command = cmd.split('/');

  if(command[1] && command[1] === 'info') {
    const stat = fs.statSync(file);
    const total = stat.size;
    return res.success({cmd, file, url, total});
  }

  const blurV = command[1] || 10;

  const filename = Math.random().toString(36).substr(2) + '.mp4';
  const filepath = path.resolve('/tmp/', filename)
  if(url) {
    ffmpeg(url)
    // .on('progress', function(info) {
    //   console.log(info);
    //   console.log('progress ' + info + '%');
    // })
    .videoFilters('boxblur=1:'+ blurV +':cr=0:ar=0')
    .on('end', function() {
      console.log('end', filepath, Date.now() - startTime);
      const stat = fs.statSync(filepath);
      const total = stat.size;
      res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
      fs.createReadStream(filepath).pipe(res);
    })
    .on('error', function(err) {
      res.error(err);
      console.log('an error happened: ' + err.message);
    })
    .save(filepath);
  } else {
    ffmpeg(file)
    .videoFilters('boxblur=1:'+ blurV +':cr=0:ar=0')
    .on('end', function() {
      // console.log(filepath);
      const stat = fs.statSync(filepath);
      const total = stat.size;
      res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
      fs.createReadStream(filepath).pipe(res);
      // console.log('file has been converted succesfully');
    })
    .on('error', function(err) {
      res.error(err);
      console.log('an error happened: ' + err.message);
    })
    // save to file
    .save(filepath);
  }
};
