//obtener el cliente
const mysql = require('mysql2');
let configData;


if (process.env.NODE_ENV === 'production'){
configData = {
    host : process.env.HOST,
    port : process.env.PORT_DB,
    password : process.env.PASSWORD_DB,
    database : 'red_social'
  }
}else{
configData = {
        host : 'localhost',
        user :'root',
        password :'',
        database : 'red_social'
    }
}
  
  if (process.env.NODE_ENV === 'production') {
    configData.dialectOptions = {
      bigNumberStrings: true,
      ssl: { rejectUnauthorized: true },
    };
  }


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