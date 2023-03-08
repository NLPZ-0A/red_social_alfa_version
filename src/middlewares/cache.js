const getExpeditiousCache = require('express-expeditious');

const defaultOptions = {
    namespace : 'expresscache', //nombre de la cache en memoria
    defaultTtl : 20*60*1000, //tiempo de respuesta(espera hasta un minuto, en ese tiempo trae la info directo de la ram)
     statusCodeExpires : { //control de cache para el status
        404: 5*60*1000,
        500: 0 // 1 minute en miliseconds
    },
   // engine: require('expeditious-engine-memory'),
    exclude: ['/admin/login', '/admin/logout']
    /*engine: require('expeditious-engine-redis')(//npm install expeditious-engine redis
        {
            host:            conectar con redis
            port
        } 
    )*/
}

const cacheInit = getExpeditiousCache(defaultOptions);

module.exports = {cacheInit}