var express = require('express');
const { fstat } = require('fs');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var parser = require('exif-parser');



/* GET photos listing. */
router.get('/', function(req, res, next) {
  res.send(JSON.stringify(scan_dir('photos')));
});

module.exports = router;


function scan_dir(dir) {
  dir = path.join(__dirname, '..', dir);
  files = fs.readdirSync(dir);

  return files.map(function(file) {
    let data = fs.readFileSync(path.join(dir, file));
    return map_file(file, data);
  });
}

function map_file(file, data) {
  metadata = parser.create(data).parse();

  return {
    filename: file,
    metadata: metadata
  }
}