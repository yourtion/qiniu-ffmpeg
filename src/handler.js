const fs = require('fs');
const http = require('http');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

module.exports = function(req, res) {
  const cmd = req.query.cmd;
  const url = req.query.url;
  const file = req.file;
  if(!cmd) return res.error('cmd');
  if(!file && !url) return res.error('file');
  const command = cmd.split('/');

  if(command[1] && command[1] === 'info') {
    const stat = fs.statSync(file);
    const total = stat.size;
    return res.success({cmd, file, url, total});
  }

  if(url) {
    res.contentType('mp4');
    // const filename = Math.random().toString(36).substr(2) + '.mp4';
    // const filepath = path.resolve('/tmp/', filename)
    ffmpeg(url)
    // .on('progress', function(info) {
    //   console.log(info);
    //   console.log('progress ' + info + '%');
    // })
    .videoFilters('boxblur=180:1:cr=0:ar=0')
    .on('end', function() {
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
    const filename = Math.random().toString(36).substr(2) + '.mp4';
    const filepath = path.resolve('/tmp/', filename)
    // var stream = fs.createWriteStream(filepath)
    ffmpeg(file)
    // .on('progress', function(info) {
    //   console.log(info);
    //   console.log('progress ' + info + '%');
    // })
    .videoFilters('boxblur=180:1:cr=0:ar=0')
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
