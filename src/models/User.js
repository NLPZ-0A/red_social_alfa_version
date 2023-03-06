const db = require('../database/db_local');
const dateTime = require('../tools/get_date_now');


module.exports = class User{

    constructor(name, username, email, password){
         this.name = name;
         this.username = username;
         this.email = email;
         this.password = password;
    }

    async getUserbyEmail(email){
        let query=`SELECT * FROM user WHERE email=${db.escape(email)}`; //let query=`SELECT * FROM ${db.escapeId('login.usuarios')} WHERE email=${db.escape(email)}`;
        return await this.doQuery(query);
    }

    async getUserbyUsername(username){
        let query=`SELECT * FROM user WHERE username=${db.escape(username)}`;
        return await this.doQuery(query);
    }

    async getUserbyId(id){
        let query=`SELECT * FROM user WHERE id='${id}'`;
        return await this.doQuery(query);
    }
    
    async getPredictByUsername(username){
        let predict = `${username}_%`
        let query = `SELECT * FROM user WHERE username LIKE ${db.escape(predict)};`;
        return await this.doQuery(query);
    }

    async getFollowedsUsers(user_id){
        let query = `SELECT user.* FROM user JOIN followers ON followers.followed_id = user.id WHERE followers.follower_id = ${db.escape(user_id)}`;
        return await this.doQuery(query);  
    }

    async addFollower(from_user_id, to_user_id){
        let query = `INSERT INTO followers SET  follower_id='${db.escape(from_user_id)}', followed_id='${db.escape(to_user_id)}'`;
        return await this.doQuery(query);  
    }

    async allRelationsFollowers(id){
        let query = `SELECT * FROM followers WHERE followed_id=${db.escape(id)}`;
        return await this.doQuery(query);
    }

    async allRelationsFollowed(id){
        let query = `SELECT * FROM followers WHERE follower_id=${db.escape(id)}`;
        return await this.doQuery(query);
    }

    async removeFollower(from_user_id, to_user_id){
        let query = `DELETE FROM followers  WHERE follower_id=${db.escape(from_user_id)} AND followed_id=${db.escape(to_user_id)}`;
        return await this.doQuery(query);
    }

    async getRelationsUsers(from_user_id, to_user_id){
            let query = `SELECT * FROM followers  WHERE follower_id=${db.escape(from_user_id)} AND followed_id=${db.escape(to_user_id)}`;
            return await this.doQuery(query);
        }

    async getAllFollowersCount(id){
        let query=`SELECT COUNT(*) as countFollowers  FROM followers es WHERE follower_id =${db.escape(id)}`;
        return await this.doQuery(query);
    }
    async getAllFollowedsCount(id){
        let query=`SELECT COUNT(*) as countFolloweds  FROM followers es WHERE followed_id =${db.escape(id)}`;
        return await this.doQuery(query);
    }

    async saveUser(){
        let dateNow = dateTime.getFullDate();
        let email_value = 0;
        let query =`INSERT INTO user SET name=${db.escape(this.name)}, username=${db.escape(this.username)}, email=${db.escape(this.email)}, password=${db.escape(this.password)}, created_at=${db.escape(dateNow)}, confirm_email=${db.escape(email_value)};`;
        return await this.doQuery(query);
    }

    async deleteUser(id){
        let query=`DELETE FROM user WHERE id=${db.escape(id)};`;
        return this.doQuery(query);
    }

    async updateUser(email){
        let query=`UPDATE user SET confirm_email=1 WHERE email=${db.escape(email)}`;
        this.doQuery(query);
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


}
