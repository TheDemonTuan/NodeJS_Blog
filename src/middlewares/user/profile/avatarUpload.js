const multer = require("multer");
const path = require("path");
const message = require("../../message");
const sharp = require('sharp');
const fs = require('fs');

const storageEngine = multer.diskStorage({
  destination: staticPath + "/img/upload/users",
  filename: (req, file, cb) => {
    const extension = file.originalname.match(/\.([^.]+)$/)[1];
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}.${extension}`);
  },
});

const checkFileType = function (req, file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|webp/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({
  storage: storageEngine,
  limits: { fileSize: 15000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(req, file, cb);
  },
}).single("avatar");

module.exports = async (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      message.set(req, res, next, "error", err.message, true, ".");
    } else if (err) {
      message.set(req, res, next, "error", err.message, true, ".");
    }
    else {
      if (!req.file) {
        if (!req.body.current_avatar) {
          message.set(req, res, next, "error", "Please upload an image.", true, ".");
        }
        else {
          req.body.avatar = res.locals.userInfo.avatar;
          next();
        };
      }
      else {
        if(res.locals.userInfo.avatar !== "/img/upload/users/guest.webp") {
          fs.unlinkSync(staticPath + res.locals.userInfo.avatar);
        };

        const webpPath = req.file.path.replace(/\.[^/.]+$/, '.webp');
        sharp(req.file.path)
          .toFormat('webp')
          .toFile(webpPath, (webpErr, info) => {
            if (webpErr) {
              // Delete file if error
              fs.unlinkSync(webpPath);
              return next(webpErr);
            }
            // Delete old image file
            fs.unlinkSync(req.file.path);
          });
        req.body.avatar = webpPath.replace(staticPath, '').replaceAll('\\', '/');
        next();
      };
    };
  });
};