const Usuario = require('../models/usuario.model');
const chalk = require('chalk');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const {success, error} = require('../controllers/response');

const login = async (req, res) => {

    const {dni, password} = req.body;

    try{

        // Se verifica el DNI
        const usuarioDB = await Usuario.findOne({dni});
        if(!usuarioDB) return error(res, 400, 'Datos incorrectos');

        // Se verifica el password
        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);
        if(!validPassword) return error(res, 400, 'Datos incorrectos');
        
        // Se verifica que el usuario este activo
        if(!usuarioDB.activo) return error(res, 400, 'Datos incorrectos');

        // Se genera el token
        const token = await generarJWT(usuarioDB.id);

        success(res, {token});

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }

}

const renewToken = async (req, res) => {
    try{
        const uid = req.uid;    // Se obtiene luego de pasar por el middleware -> validarJWT
        
        const [token, usuario] = await Promise.all([
            generarJWT(uid),
            Usuario.findById(uid, 'dni apellido nombre email role activo')
        ])

        success(res,{
            token,
            usuario
        });

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

module.exports = {
    login,
    renewToken
}