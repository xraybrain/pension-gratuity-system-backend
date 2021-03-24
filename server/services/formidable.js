const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const cloudinary = require('cloudinary');
const _ = require('lodash');
const Feedback = require('../lib/Feedback');

//-- configure cloudinary only in production
if (process.env.NODE_ENV === 'production') {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
}
function extname(fileName = '') {
  return fileName.slice(fileName.lastIndexOf('.') + 1);
}

function filter(error, fileName, filters) {
  let extension = extname(fileName);

  if (!filters.includes(extension)) error.fileType = 'File type not allowed';
}

module.exports = (
  options = { filters: [], uploadDir: '', canSkipUpload: false }
) => {
  return (req, res, next) => {
    let form = formidable.IncomingForm(); // The incoming form
    let filters = options.filters || ['jpg', 'jpeg', 'png', 'xlsx'];
    let uploadDir =
      path.join(__dirname, options.uploadDir) ||
      path.join(__dirname, '/../temp');
    let errors = {};

    form.parse(req, (err, fields, files) => {
      let fileToUpload = files.fileToUpload || files.mediaUrl;

      console.log(fields, files);

      if (fileToUpload) {
        let fileName = fileToUpload.name;
        let tempPath = fileToUpload.path;
        //-- filter this file
        filter(errors, fileName, filters);

        //-- an error occured
        if (!_.isEmpty(errors)) {
          req.body = new Feedback(errors, false, 'upload failed');
          return next();
        }

        let newFileName = `xb_${Date.now()}.${extname(fileName)}`;

        let uploadStatus = new Feedback(fields, false, '');

        //-- check node ennvironment
        if (
          process.env.NODE_ENV === 'production' &&
          extname(fileName) !== 'xlsx'
        ) {
          //-- on production use cloudinary
          cloudinary.uploader.upload(tempPath, (result) => {
            if (!result.error) {
              uploadStatus.result['uploadURL'] = result.secure_url;
              uploadStatus.success = true;
              uploadStatus.message = 'success';

              req.body = uploadStatus;
              next();
            } else {
              uploadStatus.message = 'Failed to upload file';
              uploadStatus.success = false;
              req.body = uploadStatus;
              return next();
            }
          });
        } else {
          //-- on development use local storage

          //-- check if uploadDir exists
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
          }

          //-- read the file been uploaded
          fs.readFile(tempPath, (err, data) => {
            if (err) throw err;

            uploadDir = path.join(uploadDir, newFileName);
            fs.writeFile(uploadDir, data, (err) => {
              if (err) throw err;

              uploadStatus.result['uploadURL'] = uploadDir;
              uploadStatus.result['fileName'] = newFileName;
              uploadStatus.success = true;
              uploadStatus.message = 'success';
              req.body = uploadStatus;
              next();
            });
          });
        }
      } else if (options.canSkipUpload) {
        req.body = new Feedback(
          fields.hasOwnProperty('formData')
            ? fields
            : { formData: JSON.stringify(fields) },
          true,
          'skipped'
        );
        return next();
      } else {
        req.body = new Feedback(
          null,
          false,
          'Please provide a valid file, file must be in the following format ' +
            filters.join(', ')
        );
        return next();
      }
    });
  };
};
