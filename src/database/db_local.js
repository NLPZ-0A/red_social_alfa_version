//obtener el cliente
const mysql = require('mysql2');

//crear la conexion a la base de datos
let connection;

if(process.env.NODE !== 'production'){
    console.log('local');
   connection = mysql.createConnection({
        host : process.env.HOST,
        user :process.env.USER,
        password :process.env.PASSWORD,
        database : process.env.DATABASE_NAME
    });
}else{
    console.log('production');
     connection = mysql.createConnection({
        host : 'aws-sa-east-1.connect.psdb.cloud',
          port: '3306',
          user :'u3uegk6ognbdbrtmm7ar',
          password :'	pscale_pw_2GtCjWnHWKQtDNn7sSSRXtjLewYHyeid3oel1yV1mJe',
          database : 'red_social'
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