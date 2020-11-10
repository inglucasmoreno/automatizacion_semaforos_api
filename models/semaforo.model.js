const { Schema, model } = require('mongoose');

const semaforoSchema = Schema({

    codigo: {
        type: String,
        required: true,
        trim: true    
    },

    descripcion: {
        type: String,
        required: true,
        trim: true
    },

    intermitente: {
        type: Boolean,
        required: true,
        default: false
    },

    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },

    activo: {
        type: Boolean,
        default: true
    }

});

module.exports = model('Semaforo', semaforoSchema);