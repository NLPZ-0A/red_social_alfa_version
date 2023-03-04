const db = require('../database/db_local');

module.exports = class Comment {
    constructor(user_id, post_id, content) {
        this.user_id = user_id;
        this.post_id = post_id;
        this.content = content;
        this.created_at = new Date();
      }

      async saveComment(){
        const query = `INSERT INTO comments (user_id, post_id, content, created_at) 
                        VALUES (${db.escape(this.user_id)},${db.escape(this.post_id)},${db.escape(this.content)},${db.escape(this.created_at)})`;
  
        return await this.doQuery(query);
      }

      async getCommentsByPost(post_id){
        const query = `SELECT comments.*, user.name, user.image, user.username
                       FROM comments
                       JOIN user ON comments.user_id = user.id
                       WHERE comments.post_id = ${db.escape(post_id)};`;

        return await this.doQuery(query);
      }

      async getCommentById(comment_id){
        let query = `SELECT * FROM comments WHERE id=${db.escape(comment_id)}`;
        return this.doQuery(query);
      }

      async deleteComment(comment_id){
        let query = `DELETE FROM comments WHERE id=${db.escape(comment_id)}`;
        return this.doQuery(query);
      }
     
      async addLike(user_id, comment_id){
        let query = `INSERT INTO comments_like SET user_id=${db.escape(user_id)}, comment_id=${db.escape(comment_id)}`;
        return this.doQuery(query);
      }

      async deleteLike(user_id, comment_id){
        let query = `DELETE FROM comments_like WHERE comment_id = ${db.escape(comment_id)} AND user_id = ${db.escape(user_id)}`;
        return this.doQuery(query);
      }

      async getAllLikesComments(){
        let query = `SELECT * FROM comments_like`;
        return await this.doQuery(query);
      }

      async getLikesCommentById(comment_id){
        let query = `SELECT * FROM comments_like WHERE comment_id=${comment_id}`;
        return await this.doQuery(query);
      }

      /*async getLikesCommentCount(comment_id) {
        const query = `SELECT COUNT(*) as likes FROM comments_like WHERE comment_id=${comment_id}`;
        return this.doQueryExecute(query);
      }*/


      async findOne(user_id, comment_id){
        let query = `SELECT * FROM  comments WHERE user_id=${db.escape(user_id)} AND id=${db.escape(comment_id)}`;
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
