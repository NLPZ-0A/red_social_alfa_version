const express = require('express');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
      
        cb(null, 'public/files')
    },
    filename : function(req, file, cb){
        console.log(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|mp4|avi|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      }
    });

module.exports.upload = [
    
    upload.single('image')
    ,
    (req, res, next) => {
      // aquí puede acceder a req.file y req.body
      next();
    }
  ];

/*const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images')
    },
    filename : function(req, file, cb){
        console.log(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

module.exports.upload = function (req, res, next) {
    if (req.file) {
      upload.single('image')(req, res, next);
    } else {
      next();
    }
  };*/