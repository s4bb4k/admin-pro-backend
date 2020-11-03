/**
 * Busqueda
 * Ruta: /api/todo/:busqueda
 */

const { Router } = require('express');

const { validarJWT } = require('../middlewares/validar-jwt');
const { getTodo, getDocumentoColeccion } = require('../controllers/busqueda-controller');

const router = Router();

router.get('/:busqueda', validarJWT , getTodo);
router.get('/coleccion/:tabla/:busqueda', validarJWT , getDocumentoColeccion);

module.exports = router;
