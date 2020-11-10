const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { 
        getSemaforo,
        nuevoSemaforo,
        actualizarSemaforo, 
        listarSemaforos,
        eliminarSemaforo,
    } = require('../controllers/semaforos.controllers');

const router = Router();

router.get('/:id', validarJWT, getSemaforo);
router.get('/', validarJWT, listarSemaforos);
router.post('/', [
    validarJWT,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
], nuevoSemaforo);
router.put('/:id', [
    validarJWT,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    validarCampos
], actualizarSemaforo);
router.delete('/:id', validarJWT, eliminarSemaforo);


module.exports = router;