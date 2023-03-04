const db = require('../database/db_local');

module.exports = class Notification{

        constructor(user_id, sender_id, message, isread=0, isfile=0){
           this.user_id = user_id;
           this.sender_id = sender_id;
           this.message = message;
           this.isread = isread;
           this.isfile = isfile;
        }

        async saveNotification(){
            let query = `INSERT INTO notifications SET user_id=${db.escape(this.user_id)},sender_id=${db.escape(this.sender_id)}, message=${db.escape(this.message)}, isread=${db.escape(this.isread)}, isfile=${db.escape(this.isfile)};`;
            return this.doQuery(query);
          }

        async getNotifications(user_id){
            //let query = `SELECT * FROM notifications WHERE user_id = ${db.escape(id)} ORDER BY created_at DESC;`;
            let query = `SELECT notifications.*, user.username AS sender_username, user.image AS sender_image FROM notifications JOIN user ON notifications.sender_id = user.id WHERE notifications.user_id = ${db.escape(user_id)} ORDER BY created_at DESC; `;

            return this.doQuery(query);
        }

        async viewNotifications(id){
            //let query = `SELECT * FROM notifications WHERE user_id = ${db.escape(id)} ORDER BY created_at DESC;`;
            let query = `UPDATE notifications SET isRead=1 WHERE id =${db.escape(id)} `;

            return this.doQuery(query);
        }

        async doQueryArray(query, data){
            let promesa = new Promise((resolve, reject) =>{
                const NuestroQuery = query;
               //console.log(NuestroQuery);
                    db.query(NuestroQuery, data, (err, result) =>{
                    if(err) throw err;
                    resolve(result);
                });
            });
    
            return await promesa;
        }

        async doQuery(query){
            let promesa = new Promise((resolve, reject) =>{
                let NuestroQuery = query;
                    db.query(NuestroQuery ,(err, result) =>{
                    if(err) throw err;
                    resolve(result);
                });
            });
    
            return  promesa;
        }

        async doQueryExecute(query){
            let promesa = new Promise((resolve, reject) =>{
                
                let NuestroQuery = query;

                    db.execute(NuestroQuery ,(err, result) =>{
                    if(err) throw err;
                    resolve(result);
                });
            });
    
            return promesa;
        }
};