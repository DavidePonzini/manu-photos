var express = require('express');
const { fstat } = require('fs');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var parser = require('exif-parser');



/* GET photos listing. */
router.get('/', function(req, res, next) {
  let files = scan_dir().map(function(file) {
    // Handle common data
    let result = {
      filename: file.filename,
      gps: {
        lat: undefined,
        lng: undefined
      },
      date: new Date(file.metadata.tags.DateTimeOriginal * 1000)
    };

    // Handle GPS location, if available
    if(file.metadata.tags.GPSLatitude)
      result.gps.lat = file.metadata.tags.GPSLatitude;
    if(file.metadata.tags.GPSLongitude)
      result.gps.lng = file.metadata.tags.GPSLongitude;

    return result;
  });

  res.send(JSON.stringify(files));
});

router.get('/debug', function(req, res, next) {
  let files = scan_dir();
  
  res.send(JSON.stringify(files));
});

module.exports = router;


function scan_dir(dir) {
  dir = path.join(__dirname, '../public/photos');
  files = fs.readdirSync(dir);

  return files.map(function(file) {
    let data = fs.readFileSync(path.join(dir, file));
    let metadata = parser.create(data).parse();

    return {
      filename: file,
      metadata: metadata
    }
  });
}
