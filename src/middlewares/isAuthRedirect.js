
module.exports.isAuth = async (req, res, next)=>{
   
    if(req.cookies.login){
        res.status(200).redirect('/home');
    }else{
        return next();
    }

};