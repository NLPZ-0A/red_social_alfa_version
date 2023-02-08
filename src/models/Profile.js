const db = require('../database/db_local');

module.exports = class Profile {

        constructor(data){
            this.user_id = data.user_id;
            this.phone = data.phone;
            this.job = data.job;
            this.positionJob = data.positionJob;
            this.location = data.location;
            this.birthday = data.birthday;
            this.description = data.description;
        }

        async saveProfile(){
            const profileData = profileData();
            const query = `INSERT INTO profiles (user_id, data) VALUES (${db.escape(this.user_id)}, ${db.escape(JSON.stringify(profileData))})`;
            //const data = [this.user_id, JSON.stringify(profileData)];
            
            return this.doQueryArray(query, data);
        }

        async profileData(){
            return {
                    phone : this.phone,
                    job : this.job,
                    positionJob : this.positionJob, 
                    location : this.location,
                    birthday : this.birthday, 
                    description : this.description
            }
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
                let NuestroQuery = query;
               //console.log(NuestroQuery);
                    db.query(NuestroQuery, data, (err, result) =>{
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