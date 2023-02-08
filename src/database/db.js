//obtener el cliente
const mysql = require('mysql');

//crear la conexion a la base de datos
const connection = mysql.createConnection({
    host : 'localhost',
    user :'root',
    password :'',
    database : 'red_social'
});

connection.connect((error) =>{
    if(error){
        console.error(`Error de conexion: ${error}`);
        return;
    }

    console.log('Conectado correctamente a la BBDD');
});

module.exports = connection;