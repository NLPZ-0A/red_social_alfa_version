const db = require('../database/db_local');
const dateModule = require('../tools/get_date_now');

module.exports = class Post {

        constructor(title, body, image, user_id){
            this.title = title;
            this.body = body ;
            this.image = image ;
            this.user_id = user_id;
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
            let query=`SELECT post.*, user.username,user.name,user.image AS profile_image_user FROM post JOIN user ON post.user_id=user.id WHERE post.user_id=${db.escape(id)} UNION ALL SELECT post.*,user.username,user.name,user.image AS profile_image_user FROM post JOIN followers ON post.user_id = followers.followed_id JOIN user ON post.user_id=user.id WHERE followers.follower_id=${db.escape(id)} ORDER BY created_at DESC`;
            return await this.doQuery(query);
        }
        
        async getAllPost(){
            let query=`SELECT  * FROM post`;
            return await this.doQuery(query);
        }

        //debemos primero instanciar a post
        async savePost(){
            const date = dateModule.getFullDate();
        
            let imageRoute = '';
            if(this.image !== ''){
             imageRoute = `/images/${this.image}`;
            }
            let query =`INSERT INTO post SET title=${db.escape(this.title)}, content=${db.escape(this.body)}, image=${db.escape(imageRoute)}, user_id='${db.escape(this.user_id)}', created_at=${db.escape(date)}`;

            return await this.doQuery(query);
        }

        async deletePost(id){
            let query = `DELETE FROM post WHERE id=${db.escape(id)}`;
            return await this.doQuery(query);
        }

        async updatePost(id){
            let imageRoute = '';
            let query = '';

            if( this.image !== ''){
                imageRoute = `/images/${this.image}`;
            }

            if(this.body === ''){
               query = `UPDATE post SET title=${db.escape(this.title)}, image=${db.escape(imageRoute)} WHERE post.id =${db.escape(id)}`
            }else{
                query = `UPDATE post SET title=${db.escape(this.title)}, content=${db.escape(this.body)}, image=${db.escape(imageRoute)} WHERE post.id =${db.escape(id)}`
            }

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
