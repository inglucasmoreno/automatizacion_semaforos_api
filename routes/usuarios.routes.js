const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
    listarUsuarios,
    nuevoUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios.controllers');

const router = Router();

router.get('/', validarJWT, listarUsuarios);
router.post('/', [
    validarJWT,
    check('dni', 'El dni es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    validarCampos
], nuevoUsuario);
// Nota -> Falta revisar el express-validator
router.put('/:id',validarJWT ,actualizarUsuario);
router.delete('/:id',validarJWT, eliminarUsuario);

module.exports = router;