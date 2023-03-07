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
    const url = encodeURIComponent(process.env.DATABASE_URL);
     connection = mysql.createConnection(url//'mysql://d34k184vnc4rp3hhhae8:pscale_pw_v4UreiQWLPaNAD3x4o32SHUzougN73MEcegjxRFLxwT@aws-sa-east-1.connect.psdb.cloud/red_social?ssl={"rejectUnauthorized":true}'

        /* {host : 'https://databases-auth.000webhost.com/index.php',
          port: '3306',
          user :'red_social_user',
          password :'N6k06Ba##LAjM!Gk',
          database : 'id20305985_red_social',}*/
          
    )
}

connection.connect((error) =>{
    if(error){
        console.error(`Error de conexion: ${error}`);
        return;
    }

    console.log('Conectado correctamente a la BBDD');
});

module.exports = connection;