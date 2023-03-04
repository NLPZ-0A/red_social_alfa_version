const db = require('../database/db_local');

module.exports = class Profile {

        constructor(data = {}){
            this.user_id = data.user_id;
            this.phone = data.phone;
            this.job = data.job;
            this.positionJob = data.positionJob;
            this.location = data.location;
            this.birthday = data.birthday;
            this.description = data.description;
        }

        async profileDataObject(){
            return {
                    telefono: this.phone,
                    trabajo : this.job,
                    cargo : this.positionJob, 
                    ubicacion : this.location,
                    cumpleaños : this.birthday, 
                    descripcion : this.description
            }
        }

        async saveProfile(){
            const profileData =  await this.profileDataObject();
            console.log(profileData);

            const query = `INSERT INTO profiles SET user_id = ?, ?`;
            const data = [db.escape(this.user_id), profileData];
            
            return await this.doQueryArray(query, data);
        }

        async updateProfile(){
            const profileData =  await this.profileDataObject();
            console.log(profileData);

            const query = `UPDATE profiles SET ? WHERE user_id = ?`;
            const data = [profileData, db.escape(this.user_id)];
            
            return await this.doQueryArray(query, data);
        }

        async uploadPhoto(photo, id){
            const query = `UPDATE user SET image = ${ db.escape(photo) } WHERE id = ${db.escape(id)};`;
            return await this.doQuery(query);
        }

        async getProfileById(id){
            const query = `SELECT * FROM profiles WHERE user_id = ${db.escape(id)}`;
            
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