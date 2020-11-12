const chalk = require('chalk');
const Usuario = require('../models/usuario.model');
const { success, error } = require('./response');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const listarUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const hasta = Number(req.query.hasta) || 0;    
    
    try{
        const [usuarios, total] = await Promise.all([
            Usuario.find({}, 'dni nombre apellido role email activo')
                   .skip(desde)
                   .limit(hasta),
            Usuario.countDocuments()   
        ])
        success(res, {usuarios, total});
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

const nuevoUsuario = async (req, res) => {

    try{
        const { dni, password, email } = req.body;

        // El DNI existe en la base?
        const existeUsuario = await Usuario.findOne({ dni });
        if(existeUsuario) return error(res, 400, 'El usuario ya existe');     
        

        // El Correo existe en la base?
        const existeEmail = await Usuario.findOne({ email });
        if(existeEmail) return error(res, 400, 'Este correo ya esta en uso');
        
        // Se crea el nuevo usuario
        const usuario = new Usuario(req.body);
        
        // Se encripta el password
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);
        
        // Se almacena en la base de datos
        await usuario.save();
        const token = await generarJWT(usuario.id);
        success(res, {
            usuario,
            token
        });
   
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    } 
}

const actualizarUsuario = async (req, res) => {
    
    try{
        // Se verifica que el usuario existe en la BD
        const uid = req.params.id;
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) return error(res, 404, 'El usuario no existe');
        
        // Se extraen los campos a actualizar
        const { dni, password, email ,...campos } = req.body;

        // Se actualiza el usuario
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});
        success(res, usuarioActualizado);

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
            
}

const eliminarUsuario = async (req, res) => {
    
    try{
        const uid = req.params.id;
        
        // Se verifica si el usuario existe
        const existeUsuario = await Usuario.findById(uid);
        if(!existeUsuario) return error(res, 404, 'El usuario no existe');
        
        // Se elimina el usuario
        await Usuario.findByIdAndDelete(uid);
        success(res, 'El usuario ha sido eliminado')
    
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }

} 

module.exports = {
    listarUsuarios,
    nuevoUsuario,
    actualizarUsuario,
    eliminarUsuario
}