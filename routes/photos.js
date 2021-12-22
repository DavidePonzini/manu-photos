var express = require('express');
const { fstat } = require('fs');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var parser = require('exif-parser');



/* GET photos listing. */
router.get('/', function(req, res, next) {
  let files = scan_dir();
  
  // Remove errors and missing GPS tags
  files = files.filter(function(file) {
    return !file.error && hasGpsData(file);
  });
  
  // Convert data format
  files = files.map(function(file) {
    return {
      filename: file.filename,
      gps: {
        lat: file.metadata.tags.GPSLatitude,
        lng: file.metadata.tags.GPSLongitude
      },
      date: new Date(file.metadata.tags.DateTimeOriginal * 1000)
    };
  });

  res.send(JSON.stringify(files));
});

router.get('/debug', function(req, res, next) {
  let files = scan_dir();
  
  res.send(JSON.stringify(files));
});

router.get('/error', function(req, res, next) {
  let files = scan_dir();
  
  // Leave only errors
  files = files.filter(function(file) {
    return file.error;
  });

  res.send(JSON.stringify(files));
});

router.get('/no-gps', function(req, res, next) {
  let files = scan_dir();
  
  // Remove errors and images with both tags
  files = files.filter(function(file) {
    return !file.error && !hasGpsData(file);
  });

  res.send(JSON.stringify(files));
});



module.exports = router;



function hasGpsData(file) {
  return file.metadata.tags.GPSLatitude && file.metadata.tags.GPSLongitude
}


function scan_dir(dir) {
  dir = path.join(__dirname, '../public/photos');

  // Read file list, exclude folders
  let dirents = fs.readdirSync(dir, { withFileTypes: true });
  let files = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name);

  return files.map(function(file) {
    let data = fs.readFileSync(path.join(dir, file));
    try {
      let metadata = parser.create(data).parse();

      return {
        filename: file,
        metadata: metadata
      }
    } catch (error) {
      return {
        filename: file,
        error: error.toString(),
        stacktrace: error.stack
      }
    }
  });
}
