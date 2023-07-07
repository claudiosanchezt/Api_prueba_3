// Obtenemos el metodo Router de express
const { Router } = require('express');
//CONTROLADORES
const { obtenerRecetas,
    agregarReceta,
    obtenerReceta,
    obtenerRecetaNombre,
    obtenerRecetaCategoriaNombre,
    obtenerRecetaPaisNombre,
    editarReceta,
    eliminarReceta } = require('../controllers/recetas.controllers');
//LLAMAMOS NUESTRO METODO DE VERIFICAR TOKEN.
const { TokenTrue } = require('../middlewares/auth');
const { validadorRecetas } = require('../validators/recetas.validators');
//INSTACIA DE NUESTRA ROUTER DE EXPRESS
const router = Router();
//RUTAS DE RECETAS
router.get('/', obtenerRecetas);
router.post('/', TokenTrue, [validadorRecetas], agregarReceta);
router.get('/:id', obtenerReceta);
router.get('/nombre/:name', obtenerRecetaNombre);
router.get('/categoria/:name', obtenerRecetaCategoriaNombre);
router.get('/pais/:name', obtenerRecetaPaisNombre);
router.put('/:id',TokenTrue, editarReceta);
router.delete('/:id',TokenTrue, eliminarReceta);
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = router;