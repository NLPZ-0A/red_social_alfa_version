//obtener el cliente
const mysql = require('mysql2');

//crear la conexion a la base de datos
let config

if(process.env.NODE_ENV !== 'production'){
    console.log('local');
    console.log(process.env.NODE_ENV);
   connection = mysql.createConnection({
        host : process.env.HOST,
        user :process.env.USER,
        password :process.env.PASSWORD,
        database : process.env.DATABASE_NAME
    });
}else{
    console.log('production');
    console.log(process.env.NODE_ENV);
    //const url = encodeURIComponent(process.env.DATABASE_URL);
    const url = process.env.DATABASE_URL;
    connection = mysql.createConnection(
        {
            host : process.env.HOST,
            user :process.env.USER,
            password :process.env.PASSWORD,
            database : process.env.DATABASE_NAME
        });
}

connection.connect((error) =>{
    if(error){
        console.error(`Error de conexion: ${error}`);
        return;
    }

    console.log('Conectado correctamente a la BBDD');
});

module.exports = connection;