//--------------------------------------MODELOS-----------------------------------------------------------------------------
const Profile = require('../models/Profile');

const profileInstance =  new Profile({});

const myAccount = async (req, res) => {
    const profileReq =  await profileInstance.getProfileById(req.usuario.id);
    const profileData = profileReq[0];
   
    return res.render('form-edit-profile', {title: 'configuracion', profileData : profileData, user : req.usuario});
};

const editAccount = async(req, res) => {
    const profileReq =  await profileInstance.getProfileById(req.usuario.id);
    const profileData = profileReq[0];
   
    return res.render('form-edit-profile', {title: 'configuracion', profileData : profileData, user : req.usuario});
};



module.exports = {myAccount, editAccount};