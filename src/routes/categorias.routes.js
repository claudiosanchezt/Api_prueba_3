// Obtenemos el metodo Router de express
const { Router } = require('express');
//CONTROLADORES
const { obtenerCategorias,
    agregarCategoria,
    obtenerCategoria,
    editarCategoria,
    eliminarCategoria, 
    obtenerCategoriaNombre} = require('../controllers/categorias.controllers');

//LLAMAMOS NUESTRO METODO DE VERIFICAR TOKEN.
const { TokenTrue } = require('../middlewares/auth');
const { validadorCategorias } = require('../validators/categorias.validators');
//INSTACIA DE NUESTRA ROUTER DE EXPRESS
const router = Router();
//RUTAS DE CATEGORIAS
router.get('/', obtenerCategorias);
router.post('/', TokenTrue, [validadorCategorias], agregarCategoria);
router.get('/nombre/:name', obtenerCategoriaNombre);
router.get('/:id', obtenerCategoria);
router.put('/:id',TokenTrue, editarCategoria);
router.delete('/:id',TokenTrue, eliminarCategoria);
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = router;