const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const { error } = require('../controllers/response');

const validarJWT = (req, res, next) => {
    try{
        // Se verifica que se reciba un token
        const token = req.header('x-token');
        if(!token) return error(res, 401, 'No hay token en la peticion');
        
        // Se verifica que el token recibido sea valido y se obtiene el payload
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

module.exports = {
    validarJWT
}