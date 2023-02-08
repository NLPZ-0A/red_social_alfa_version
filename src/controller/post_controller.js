const db = require('../database/db_local');
const dateModule =  require('../tools/get_date_now');

module.exports = class DB{

    constructor(){
        //this.db = db;
    }

    async getUserPostById(id){
        let query=`SELECT post.*, user.username,user.name,user.image AS profile_image_user FROM post JOIN user ON post.user_id=user.id WHERE post.user_id=${db.escape(id)} ORDER BY created_at DESC`; //let query=`SELECT * FROM ${db.escapeId('login.usuarios')} WHERE email=${db.escape(email)}`;
        return await this.doQuery(query);
    }

    async getFriendsPostFeed(id)
    {
        let query=`SELECT post.*, user.username,user.name,user.image AS profile_image_user FROM post JOIN user ON post.user_id=user.id WHERE post.user_id=${db.escape(id)} UNION ALL SELECT post.*,user.username,user.name,user.image AS profile_image_user FROM post JOIN followers ON post.user_id = followers.followed_id JOIN user ON post.user_id=user.id WHERE followers.follower_id=${db.escape(id)} ORDER BY created_at DESC`;
        return await this.doQuery(query);
    }

    async savePost(data){
        const date = dateModule.getFullDate();
        console.log(date);
        let query =`INSERT INTO post SET title=${db.escape(data.title)}, content=${db.escape(data.content)}, image=${db.escape(data.image)}, user_id='${db.escape(data.user_id)}', created_at=${db.escape(date)}`;
        console.log(query);
        return await this.doQuery(query);
    }

    async getLikeforPost(id_post){
        let query =`SELECT * FROM post_like WHERE post_id=${db.escape(id_post)}`;
        return await this.doQuery(query);
    }

    async isLikePost(user_id, post_id){
        let query = `SELECT * FROM  post_like WHERE user_id=${db.escape(user_id)} AND post_id=${db.escape(post_id)}`;
        return await this.doQuery(query);
    }

    async saveLike(user_id, post_id){
        let query = `INSERT INTO post_like SET  user_id=${db.escape(user_id)}, post_id=${db.escape(post_id)}`;
        return await this.doQuery(query);
    }

    async deleteLike(user_id, post_id){
        let query = `DELETE FROM post_like WHERE user_id=${db.escape(user_id)} AND post_id=${db.escape(post_id)}`;
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

