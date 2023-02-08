const db = require('../database/db_local');

module.exports = class Like {
    constructor(user_id, post_id) {
        this.user_id = user_id;
        this.post_id = post_id;
      }

      async addLike(){
        let query = `INSERT INTO post_like SET user_id=${db.escape(this.user_id)}, post_id=${db.escape(this.post_id)}`;
        return this.doQuery(query);
      }

      async deleteLike(user_id, post_id){
        let query = `DELETE FROM post_like WHERE post_id = ${db.escape(post_id)} AND user_id = ${db.escape(user_id)}`;
        return this.doQuery(query);
      }

      async findOne(user_id, post_id){
        let query = `SELECT * FROM  post_like WHERE user_id=${db.escape(user_id)} AND post_id=${db.escape(post_id)}`;
        return await this.doQuery(query);
      }


      async doQuery(query){
        let promesa = new Promise((resolve, reject) =>{
            let NuestroQuery = query;
            db.query(NuestroQuery ,(err, result) =>{
                if(err) throw err;
                resolve(result);
            });
        });

        return promesa;
    }

}