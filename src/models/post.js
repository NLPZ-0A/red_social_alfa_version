const db = require('../database/db_local');
const dateModule = require('../tools/get_date_now');

module.exports = class Post {

        constructor(title, body, file, user_id, to_user_id ='', to_id_post='', originalContent='', dateReply=''){
            this.title = title;
            this.body = body ;
            this.file = file ;
            this.user_id = user_id;
            this.to_user_id = to_user_id;
            this.category_post = null;
            this.to_id_post = to_id_post;
            this.originalContent = originalContent;
            this.dateReply = dateReply
            //this.db = db;
            this.likes = [];
        }


        async getPostById(id){
            let query=`SELECT post.*, user.username,user.name,user.image AS profile_image_user FROM post JOIN user ON post.user_id=user.id WHERE post.id=${db.escape(id)} ORDER BY created_at DESC`; //let query=`SELECT * FROM ${db.escapeId('login.usuarios')} WHERE email=${db.escape(email)}`;
            return await this.doQuery(query);
        }
        
        async getPostByUserId(id){
            let query = `SELECT post.*, user.username, user.name, user.image as profile_image_user from post  JOIN user ON post.user_id=user.id  WHERE post.user_id = ${db.escape(id)} ORDER BY created_at DESC`;
            return await this.doQuery(query);
        }

        async getFriendsPostFeed(id){
            //let query=`SELECT post.*, user.username, user.name, user.image AS profile_image_user FROM post JOIN user ON post.user_id=user.id WHERE post.user_id=${db.escape(id)} UNION ALL SELECT post.*, user.username, user.name, user.image AS profile_image_user FROM post JOIN followers ON post.user_id = followers.followed_id JOIN user ON post.user_id=user.id WHERE followers.follower_id=${db.escape(id)} UNION ALL SELECT post.*, user.username AS profile_username, user.name AS profile_name, user.image AS profile_image FROM post JOIN user ON post.to_user_id= user.id WHERE post.to_user_id=${db.escape(this.to_user_id)} ORDER BY created_at DESC`;
            //let query = `SELECT post.*, user.username, user.name, user.image AS profile_image_user, post_creator.username AS created_by_username, post_creator.name AS created_by_name,post_creator.image AS profile_image_created_by FROM post JOIN user ON post.user_id = user.id LEFT JOIN user AS post_creator ON post.to_user_id = post_creator.id WHERE post.user_id = ${db.escape(id)} UNION ALL SELECT post.*, user.username, user.name, user.image AS profile_image_user, post_creator.username AS created_by_username, post_creator.name AS created_by_name, post_creator.image AS profile_image_created_by FROM post  JOIN followers ON post.user_id = followers.followed_id JOIN user ON followers.followed_id = user.id LEFT JOIN user AS post_creator ON post.creator_id = post_creator.id WHERE followers.follower_id = ${db.escape(id)} ORDER BY created_at DESC;`

            let query;
            if(process.env.NODE_ENV !== 'production'){
                query = `SELECT post.*, user.username, user.name, user.image AS profile_image_user, post_creator.username AS created_by_username, post_creator.name AS created_by_name, post_creator.image AS profile_image_created_by FROM post JOIN user ON post.user_id = user.id LEFT JOIN user AS post_creator ON post.to_user_id = post_creator.id WHERE post.user_id = ${db.escape(id)} UNION ALL SELECT post.*,  user.username, user.name, user.image AS profile_image_user, post_creator.username AS created_by_username, post_creator.name AS created_by_name, post_creator.image AS profile_image_created_by FROM post JOIN followers ON post.user_id = followers.followed_id JOIN user ON followers.followed_id = user.id LEFT JOIN user AS post_creator ON post.to_user_id = post_creator.id WHERE followers.follower_id = ${db.escape(id)} ORDER BY created_at DESC;`
            }else{
                query = `SELECT * FROM (SELECT post.*, user.username, user.name, user.image AS profile_image_user, post_creator.username AS created_by_username, post_creator.name AS created_by_name, post_creator.image AS profile_image_created_by FROM post JOIN user ON post.user_id = user.id LEFT JOIN user AS post_creator ON post.to_user_id = post_creator.id WHERE post.user_id = ${db.escape(id)} UNION ALL SELECT post.*, user.username, user.name, user.image AS profile_image_user, post_creator.username AS created_by_username, post_creator.name AS created_by_name, post_creator.image AS profile_image_created_by FROM post JOIN followers ON post.user_id = followers.followed_id JOIN user ON followers.followed_id = user.id LEFT JOIN user AS post_creator ON post.to_user_id = post_creator.id WHERE followers.follower_id = ${db.escape(id)}) AS subquery ORDER BY created_at DESC;`
            }
            
            return await this.doQuery(query);
        }

        
        async getAllPost(){
            let query=`SELECT  * FROM post`;
            return await this.doQuery(query);
        }

        //debemos primero instanciar a post
        async savePost(){
            const date = dateModule.getFullDate();
            let fileRoute = '';
            if(this.file !== ''){
             fileRoute = `/files/${this.file}`;
            }

            let query =`INSERT INTO post SET title=${db.escape(this.title)}, content=${db.escape(this.body)}, file=${db.escape(fileRoute)}, user_id='${db.escape(this.user_id)}', category_id='${db.escape(this.category_id)}', created_at=${db.escape(date)}`;

            return await this.doQuery(query);
        }

        async deletePost(id){
            let query = `DELETE FROM post WHERE id=${db.escape(id)}`;
            return await this.doQuery(query);
        }

        async updatePost(id){
            let query = '';

            let fileRoute = '';
            if(this.file !== ''){
             fileRoute = `/files/${this.file}`;
            }

            if(this.body === ''){
               query = `UPDATE post SET title=${db.escape(this.title)}, file=${db.escape(fileRoute)} WHERE post.id =${db.escape(id)}`
            }else if(this.body !== '' && fileRoute === '' ){
                query = `UPDATE post SET title=${db.escape(this.title)}, content=${db.escape(this.body)} WHERE post.id =${db.escape(id)}`
            }else{
                query = `UPDATE post SET title=${db.escape(this.title)}, content=${db.escape(this.body)}, file=${db.escape(fileRoute)} WHERE post.id =${db.escape(id)}`
            }

             return await this.doQuery(query);
        }

        //compartir post
        async replyPost(){
            let query = `INSERT INTO post SET title=${db.escape(this.title)}, content=${db.escape(this.body)}, file=${db.escape(this.file)}, user_id='${db.escape(this.user_id)}', category_post='1', to_user_id=${db.escape(this.to_user_id)}, to_id_post =${db.escape(this.to_id_post)}, original_content=${db.escape(this.originalContent)}, date_reply =${db.escape(this.dateReply)}`;         
            return await this.doQuery(query);
        }

        //tomo el like y lo añado a cola
        addLike(like) {
            this.likes.push(like);
        }
        
        //si llamo al objeto like y este tiene el mismo valor que el like dado(ya existe) entonces lo quitamos
        removeLike(like) {
            this.likes = this.likes.filter(myLike => myLike.id !== like.id);
        }

        //obtener el numero de likes del objeto
        getLikeCount() {
            return this.likes.length;
        }

        async getLikes(id) {
            const query = `SELECT COUNT(*) as likes FROM post_like WHERE post_id = ${id}`;
            return this.doQueryExecute(query);
          }

        async getLikeforPost(post_id){
            let query =`SELECT * FROM post_like WHERE post_id=${db.escape(post_id)}`;
            return await this.doQuery(query);
        }

        async isLikePost(user_id, post_id){
            let query = `SELECT * FROM  post_like WHERE user_id=${db.escape(user_id)} AND post_id=${db.escape(post_id)}`;
            return await this.doQuery(query);
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


}
