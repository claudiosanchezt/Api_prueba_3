// Obtenemos el metodo Router de express
const { Router } = require('express');
//CONTROLADORES
const { obtenerPaises,
    agregarPais,
    obtenerPais,
    obtenerPaisNombre,
    editarPais,
    eliminarPais } = require('../controllers/paises.controllers');
//LLAMAMOS NUESTRO METODO DE VERIFICAR TOKEN.
const { TokenTrue } = require('../middlewares/auth');
const { validadorPaises } = require('../validators/paises.validators');
//INSTACIA DE NUESTRA ROUTER DE EXPRESS
const router = Router();
//RUTAS DE PAISES
router.get('/', obtenerPaises);
router.post('/', TokenTrue, [validadorPaises], agregarPais);
router.get('/:id', obtenerPais);
router.get('/nombre/:name', obtenerPaisNombre);
router.put('/:id',TokenTrue, editarPais);
router.delete('/:id',TokenTrue, eliminarPais);
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = router;