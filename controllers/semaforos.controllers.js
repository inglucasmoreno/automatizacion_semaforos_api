const Semaforo = require('../models/semaforo.model');
const { success, error } = require('../controllers/response');
const chalk = require('chalk');

const getSemaforo = async (req, res) => {
    const id = req.params.id;
    try{
        const semaforo = await Semaforo.findById(id)
                                       .populate('usuario', 'dni apellido nombre email');
        if(!semaforo){
            return error(res, 404, 'El semaforo no existe');
        }    
        success(res,{ semaforo });
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

const listarSemaforos = async (req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limit = Number(req.query.limit) || 0;
    const filtroActivo = req.query.activo || '';
    const filtroIntermitente = req.query.intermitente || '';
    const filtroDescripcion = req.query.descripcion || '';

    try{

        const busqueda = {}
        if(filtroActivo) busqueda.activo = filtroActivo;
        if(filtroIntermitente) busqueda.intermitente = filtroIntermitente;
        if(filtroDescripcion) {
            const regex = new RegExp(filtroDescripcion, 'i');
            busqueda.descripcion = regex;
        }
        
        // console.log(busqueda);

        const [semaforos, total] = await Promise.all([
            Semaforo.find(busqueda,'codigo descripcion intermitente usuario activo')
                    .populate('usuario', 'dni apellido nombre email')
                    .skip(desde)
                    .limit(limit)
                    .sort({codigo: 1}),
            Semaforo.find(busqueda).countDocuments()
        ])

        success(res, { semaforos, total });

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

const nuevoSemaforo = async (req, res) => {
    try{    
    
        const uid = req.uid;

        // Se verifica si el codigo ya esta en uso
        const { codigo } = req.body;
        const existeSemaforo = await Semaforo.findOne({ codigo });
        if(existeSemaforo) return error(res, 400, 'Ese codigo ya esta en uso');

        // Se crea el nuevo semaforo
        const semaforo = new Semaforo({
            usuario: uid,
            ...req.body
        });
        await semaforo.save(); 
        success(res, { semaforo });
    
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}

const actualizarSemaforo = async (req, res) => {
    try{
        
        // Se verifica si el semaforo existe
        const id = req.params.id;
        const semaforoDB = await Semaforo.findById(id);
        if(!semaforoDB) return error(res, 404, 'El semaforo no existe');

        // Se verifica si el nuevo codigo no esta registrado (En caso de que se quiera actualizar codigo)
        const { codigo } = req.body;
        if(codigo !== semaforoDB.codigo){
            const codigoExiste = await Semaforo.findOne({codigo});
            if(codigoExiste) return error(res, 400, 'Ese codigo ya esta registrado'); 
        }

        // Se actualiza el semaforo
        const semaforo = await Semaforo.findByIdAndUpdate(id, req.body, {new: true});
        success(res, { semaforo });

    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
} 

const eliminarSemaforo = async  (req, res) => {
    try{
        
        // Se verifica si el semaforo existe
        const id = req.params.id;
        const semaforoDB = await Semaforo.findById(id);
        if(!semaforoDB) return error(res, 404, 'El semaforo no existe');

        // Se elimina el semaforo
        const semaforo = await Semaforo.findByIdAndDelete(id);
        success(res, { semaforo });
        
    }catch(err){
        console.log(chalk.red(err));
        error(res, 500);
    }
}


module.exports = {
    getSemaforo,
    listarSemaforos,
    nuevoSemaforo,
    actualizarSemaforo,
    eliminarSemaforo
}