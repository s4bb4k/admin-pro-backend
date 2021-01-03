/******************************
    Ruta: /api/usuarios
*******************************/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarAdminrole, validarAdminroleOMismoUsuario } = require('../middlewares/validar-jwt');

const { getUsuario, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios-controller');

const router = Router();

router.get('/', validarJWT, getUsuario);

router.post('/',
[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos,
],
 crearUsuario);

router.put('/:id',
[
    validarJWT, 
    validarAdminroleOMismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos,
],
actualizarUsuario);

router.delete('/:id', 
    [validarJWT, validarAdminrole], 
    borrarUsuario
);

module.exports = router;