const jwt = require('jsonwebtoken');

const getToken= (id) =>{
    console.log(id);
    return jwt.sign({id},  process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
};

const getTokenData = (token) =>{
    let data = null;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if(err){
            console.log('error al obtener el token');
        }else{
            data = decoded;
        }

    });

    return data;
};

module.exports ={

    getToken,
    getTokenData
    
}
