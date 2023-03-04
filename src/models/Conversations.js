const db = require('../database/db_local');

module.exports = class Conversation{

        constructor(user_id, to_user_id){
           this.user_id = user_id;
           this.to_user_id = to_user_id;
        }

        async saveConversation(){
            let query = `INSERT INTO conversations SET user_id=${db.escape(this.user_id)}, to_user_id=${db.escape(this.to_user_id)}`;
            return this.doQuery(query);
          }

        async getConversationBetweenUsers(user_id, to_user_id){
            let query =`SELECT * FROM conversations WHERE (user_id =${db.escape(user_id)} AND to_user_id = ${db.escape(to_user_id)}) OR (user_id = ${db.escape(to_user_id)} AND to_user_id = ${db.escape(user_id)});`;
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
               //console.log(NuestroQuery);
                    db.query(NuestroQuery ,(err, result) =>{
                    if(err) throw err;
                    resolve(result);
                });
            });
    
            return promesa;
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