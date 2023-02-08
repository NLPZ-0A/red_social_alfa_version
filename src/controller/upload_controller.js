const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/images')
    },
    filename : function(req, file, cb){
        console.log(file.originalname);
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({storage: storage});

module.exports.upload = upload.single('image');

/*module.exports.uploadFiles = (req, res) =>{
    res.send({data:'enviar archivos'});
}*/