const sharp = require('sharp');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const formidable = require('formidable');
const message = require("../../middlewares/message");
const form = formidable({
  keepExtensions: true,
  uploadDir: staticPath + '/img/upload/posts',
});


exports.add = async (req, res, next) => {
  form.parse(req, (err, fields, files) => {
    req.body = fields;
    const file = files.thumbnail;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // Check if error
    if (err) {
      // Delete file if error
      fs.unlinkAsync(file.filepath);
      return message.set(req, res, next, "error", err.message, true, "/admin/posts/add");
    }

    // Check if file not uploaded
    if (file.size <= 0) {
      // Delete file if not uploaded
      fs.unlinkAsync(file.filepath);
      return message.set(req, res, next, "error", "Please upload a thumbnail.", true, "/admin/posts/add");
    }

    if (allowedTypes.includes(file.mimetype)) {
      // create new path for image file before converted to WebP
      const newPath = file.filepath.replace(/\.[^/.]+$/, '.webp');

      // Use Sharp to convert image format to WebP
      sharp(file.filepath)
        .toFormat('webp')
        .toFile(newPath, (err, info) => {
          if (err) {
            // Delete file if error
            fs.unlinkAsync(file.filepath);
            return next(err);
          }
          // Delete old image file
          fs.unlinkAsync(file.filepath);
        });
      // Set new path for image file
      req.body.thumbnail = newPath.replace(staticPath, '');
    } else {
      // Delete file if not supported
      fs.unlinkAsync(file.filepath);
      return message.set(req, res, next, "error", "File type is not supported!", true, "/admin/posts/add");
    }
    next();
  });
};

exports.edit = async (req, res, next) => {
  form.parse(req, (err, fields, files) => {
    req.body = fields;
    const file = files.thumbnail;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    // Check if error
    if (err) {
      // Delete file if error
      fs.unlinkAsync(file.filepath);
      return message.set(req, res, next, "error", err.message, true, "/admin/posts/edit");
    }

    // Check if file not uploaded
    if (file.size <= 0) {
      // Delete trash file
      fs.unlinkAsync(file.filepath);
      req.body.thumbnail = req.body.oldThumbnail;
      return next();
    }else
      fs.unlinkAsync(staticPath + req.body.oldThumbnail);

    if (allowedTypes.includes(file.mimetype)) {
      // create new path for image file before converted to WebP
      const newPath = file.filepath.replace(/\.[^/.]+$/, '.webp');

      // Use Sharp to convert image format to WebP
      sharp(file.filepath)
        .toFormat('webp')
        .toFile(newPath, (err, info) => {
          if (err) {
            // Delete file if error
            fs.unlinkAsync(file.filepath);
            return next(err);
          }
          // Delete old image file
          fs.unlinkAsync(file.filepath);
        });
      // Set new path for image file
      req.body.thumbnail = newPath.replace(staticPath, '');
    } else {
      // Delete file if not supported
      fs.unlinkAsync(file.filepath);
      return message.set(req, res, next, "error", "File type is not supported!", true, "/admin/posts/edit");
    }
    next();
  });
};