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
     connection = mysql.createConnection('mysql://d34k184vnc4rp3hhhae8:pscale_pw_v4UreiQWLPaNAD3x4o32SHUzougN73MEcegjxRFLxwT@aws-sa-east-1.connect.psdb.cloud/red_social?ssl={"rejectUnauthorized":true}'

       /* {host : 'aws-sa-east-1.connect.psdb.cloud',
          port: '3306',
          user :'u3uegk6ognbdbrtmm7ar',
          password :'pscale_pw_2GtCjWnHWKQtDNn7sSSRXtjLewYHyeid3oel1yV1mJe',
          database : 'red_social',
          dialect: 'mysql',
          dialectModule : mysql2,
          operatorsAliases: 0,}*/
    );
}

connection.connect((error) =>{
    if(error){
        console.error(`Error de conexion: ${error}`);
        return;
    }

    console.log('Conectado correctamente a la BBDD');
});

module.exports = connection;