//obtener el cliente
const mysql = require('mysql2');

//crear la conexion a la base de datos
const connection = mysql.createConnection({
    host : process.env.HOST,
    user :process.env.USER,
    password :process.env.PASSWORD,
    database : process.env.DATABASE_NAME
});

connection.connect((error) =>{
    if(error){
        console.error(`Error de conexion: ${error}`);
        return;
    }

    console.log('Conectado correctamente a la BBDD');
});

module.exports = connection;