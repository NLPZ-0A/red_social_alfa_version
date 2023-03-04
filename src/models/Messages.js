const db = require('../database/db_local');

module.exports = class Message{

        constructor(conversation_id, receiver_id, sender_id, message){
           this.conversation_id = conversation_id;
           this.receiver_id = receiver_id;
           this.sender_id = sender_id;
           this.message = message;
        }

        async saveMessage(){
            let query = `INSERT INTO messages SET conversation_id=${db.escape(this.conversation_id)}, receiver_id=${db.escape(this.receiver_id)}, sender_id=${db.escape(this.sender_id)}, message=${db.escape(this.message)};`;
            return this.doQuery(query);
          }

        async getMessagesBetweenUsers(user_id, to_user_id){

            let query = `SELECT messages.*, user.name as sender_name, user.image as sender_image FROM messages JOIN user ON user.id = messages.sender_id WHERE conversation_id = (SELECT id FROM conversations WHERE (user_id = ${db.escape(user_id)} AND to_user_id = ${db.escape(to_user_id)}) OR ( to_user_id = ${db.escape(user_id)} AND user_id = ${db.escape(to_user_id)})) ORDER BY created_at ASC;`;

            //let query=`SELECT messages.*, user1.name as name, user1.image as image, user2.name as user2_username, user2.image as user2_image FROM messages JOIN user as user1 ON user1.id = messages.sender_id JOIN user as user2 ON user2.id = messages.receiver_id WHERE conversation_id = (SELECT id FROM conversations WHERE (user_id = ${db.escape(user_id)} AND to_user_id = ${db.escape(to_user_id)}) OR ( to_user_id = ${db.escape(user_id)} AND user_id = ${db.escape(to_user_id)}));`;
            //let query =`SELECT * FROM messages WHERE conversation_id = (SELECT id FROM conversations WHERE (user_id =${db.escape(user_id)} AND to_user_id = ${db.escape(to_user_id)}) OR ( to_user_id = ${db.escape(user_id)} AND user_id = ${db.escape(to_user_id)}));`;
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