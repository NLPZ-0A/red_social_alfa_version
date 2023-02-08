const db = require('./db_local');
const dateTime = new Date();

module.exports = class DB{

    constructor(db){
        this.db = db;
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

    async relationsFollower(from_user_id, to_user_id){
        let query = `SELECT * FROM followers  WHERE follower_id=${db.escape(from_user_id)} AND followed_id=${db.escape(to_user_id)}`;
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

    async deleteRelationsFollower(from_user_id, to_user_id){
        let query = `DELETE FROM followers  WHERE follower_id=${db.escape(from_user_id)} AND followed_id=${db.escape(to_user_id)}`;
        return await this.doQuery(query);
    }

    async relationFollowerInsert(from_user_id, to_user_id){
        let query = `INSERT INTO followers SET  follower_id='${db.escape(from_user_id)}', followed_id='${db.escape(to_user_id)}'`;
        console.log(query);
        return await this.doQuery(query);  
    }

    async saveUser(data){
        let dateNow =`${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()}`;
        let email_value = 0;
        let query =`INSERT INTO user SET name=${db.escape(data.nombre)}, username=${db.escape(data.username)}, email=${db.escape(data.email)}, password=${db.escape(data.password)}, created_at=${db.escape(dateNow)}, confirm_email=${db.escape(email_value)}`;
        return await this.doQuery(query);
    }

    async doQuery(query){
        let promesa = new Promise((resolve, reject) =>{
            let NuestroQuery = query;
            this.db.query(NuestroQuery ,(err, result) =>{
                if(err) throw err;
                resolve(result);
            });
        });

        return promesa;
    }

}