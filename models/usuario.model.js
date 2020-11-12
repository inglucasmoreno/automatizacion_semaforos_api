const { Schema, model } = require('mongoose');

const usuarioSchema = Schema({

    dni: { // Se usa como usuario del sistema
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    apellido: {
        type: String,
        required: true,
        trim: true
    },
    
    nombre: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    role: {
       type: String,
       default: 'USER_ROLE'
    },
    
    activo: {
        type: Boolean,
        default: true
    }

});

// Solo para fines visuales
usuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();    // Se evita extraer el password
    object.uid = _id;
    return object;
});

module.exports = model('Usuario', usuarioSchema);