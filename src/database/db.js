//obtener el cliente
const mysql = require('mysql2');

let configData;
console.log('en la bbdd');


if(process.env.NODE_ENV === 'production'){

   console.log('production');
  configData = process.env.DATABASE_URL

        configData = {
          host : 'aws-sa-east-1.connect.psdb.cloud',
          port: '3306',
          user :'u3uegk6ognbdbrtmm7ar',
          password :'	pscale_pw_2GtCjWnHWKQtDNn7sSSRXtjLewYHyeid3oel1yV1mJe',
          database : 'red_social'
      }


}else{
  configData = {
          host : 'localhost',
          user :'root',
          password :'',
          database : 'red_social'
      }
      console.log('local');
}
  
  /*if (process.env.NODE_ENV === 'production') {
    configData.dialectOptions = {
      bigNumberStrings: true,
      ssl: { rejectUnauthorized: true },
    };
  }*/

//crear la conexion a la base de datos
const connection = mysql.createConnection(configData);

connection.connect((error) =>{
    if(error){
        console.error(`Error de conexion: ${error}`);
        return;
    }

    console.log('Conectado correctamente a la BBDD');
});



module.exports = connection;