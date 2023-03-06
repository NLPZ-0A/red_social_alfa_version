const notifications = require('../models/notifications');
const moment = require('moment');
const momentDuration = require("moment-duration-format");
momentDuration(moment)
const parseSQL = require('../tools/parseSQL');
//moment.locale('es');


const notificationsInstance = new notifications();

const getNotifications = async(req, res) =>{
    try{

        const getNotifications = await notificationsInstance.getNotifications(req.usuario.id);
        const objectNotify = parseSQL(getNotifications);
        let notifications = [];

        objectNotify.forEach(notification => {

            const now = moment(); // Obtiene la fecha actual
           

            const diff = moment(now).diff(notification.created_at, 'seconds'); // Obtiene la diferencia de tiempo en segundos
            
            const formattedDiff = moment.duration(diff, 'seconds').format("h [hrs]");
            console.log(formattedDiff);

                notification.date_not = formattedDiff;
                notifications.push(notification);
        });


                          
    return res.status(200).send(notifications);
    }catch(err){
        console.log(err);
        return res.status(503).send({message : 'error'});
    }
};

const viewNotifications =  async(req, res) =>{
    try{
        const id = req.params.id;
        const viewNotification = await notificationsInstance.viewNotifications(id);

        return res.status(200).send({message:'enviado correctamente!'});
    }catch(err){
        console.log(err);
        return res.status(503).send({message : 'error'});
    }
};


module.exports = {getNotifications,viewNotifications};