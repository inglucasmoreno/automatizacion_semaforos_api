const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { check } = require('express-validator');
const { 
        nuevoSemaforo,
        actualizarSemaforo, 
        listarSemaforos,
        eliminarSemaforo
    } = require('../controllers/semaforos.controllers');

const router = Router();

router.get('/', validarJWT, listarSemaforos);
router.post('/', [
    validarJWT,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('intermitente', 'El estado de intermitencia es obligatorio').not().isEmpty(),
    validarCampos
], nuevoSemaforo);
router.put('/:id', [
    validarJWT,
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('intermitente', 'El estado de intermitencia es obligatorio').not().isEmpty(),
    validarCampos
], actualizarSemaforo);
router.delete('/:id', validarJWT, eliminarSemaforo);


module.exports = router;