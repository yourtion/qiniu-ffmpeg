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

  const blurH = command[1] || 48;
  const blurW = command[2] || 1;
  const blurC = command[3] || 10;
  const blurA = command[4] || 10;

  const p = `boxblur=${ blurH }:${ blurW }:cr=${ blurC }:ar=${ blurA }`

  const filename = Math.random().toString(36).substr(2) + '.mp4';
  const filepath = path.resolve('/tmp/', filename)
  if(url) {
    res.contentType('mp4');
    ffmpeg(url)
    .format('mp4')
    .outputOptions([
            '-profile:v', 'high',
            '-strict', '-2',
            '-threads', '0'
        ])
    .on('progress', function(info) {
      console.log(info);
      console.log('progress ' + info + '%');
    })
    .videoFilters(p)
    .on('end', function() {
      console.log('end', filepath, Date.now() - startTime);
      // const stat = fs.statSync(filepath);
      // const total = stat.size;
      
      // fs.createReadStream(filepath).pipe(res);
    })
    .on('error', function(err, stdout, stderr) {
      console.log("ffmpeg stdout:\n" + stdout);
      console.log("ffmpeg stderr:\n" + stderr);
      console.log('an error happened: ' + err.message);
      // res.error(err);
    })
   .pipe(res, { end: true });
  } else {
    ffmpeg(file)
    .videoFilters(p)
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
    // save to file
    .save(filepath);
  }
};
