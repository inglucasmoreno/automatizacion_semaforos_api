const { Router } = require('express');
const {
    listarUsuarios,
    nuevoUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuarios.controllers');

const router = Router();

router.get('/', listarUsuarios);
router.post('/', nuevoUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);


module.exports = router;