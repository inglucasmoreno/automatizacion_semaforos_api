const chalk = require('chalk');
const Usuario = require('../models/usuario.model');
const { success, error } = require('./response');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuario = async (req, res) => {
    const id = req.params.id;
    try{
        const usuario = await Usuario.findById(id, 'dni nombre apellido role email activo');
        success(res, {usuario});
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);    
    }
}

const listarUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limit = Number(req.query.limit) || 0;    
    const filtroActivo = req.query.activo || '';                // Para buscar usuarios activos/inactivos
    const filtroDni = req.query.dni || ''; 

    try{
        const busqueda = {};
        if(filtroActivo) busqueda.activo = filtroActivo;
        if(filtroDni){
            const regex = new RegExp(filtroDni, 'i');      // Expresion regular para busqueda insensible
            busqueda.dni = regex;
        }
        const [usuarios, total] = await Promise.all([
            Usuario.find(busqueda, 'dni nombre apellido role email activo')
                   .skip(desde)
                   .limit(limit)
                   .sort({apellido: 1}),
            Usuario.find(busqueda).countDocuments()   
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
    const { dni, email, password } = req.body; 
    try{
        // Se verifica que el usuario existe en la BD
        const uid = req.params.id;
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB) return error(res, 404, 'El usuario no existe');
        
        // Se verifica si el DNI ya esta registrado
        if(dni !==  usuarioDB.dni){
            const dniExiste = await Usuario.findOne({dni});
            if(dniExiste) return error(res, 400, 'Ese DNI ya esta registrado');
        }
        
        // Se verifica si el Correo ya esta registrado
        if(email !==  usuarioDB.email){
            const emailExiste = await Usuario.findOne({email});
            if(emailExiste) return error(res, 400, 'Ese email ya esta registrado');
        }
        
        // Se encripta el password en caso de que sea necesario
        if(password){   
            const salt = bcryptjs.genSaltSync();
            req.body.password = bcryptjs.hashSync(password, salt);
        }

        // Se actualiza el usuario
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, req.body, {new: true});
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
    getUsuario,
    listarUsuarios,
    nuevoUsuario,
    actualizarUsuario,
    eliminarUsuario
}