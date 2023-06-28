// Obtenemos el metodo Router de express
const { Router } = require('express');
//CONTROLADORES
const { obtenerCaruselTodos,
    obtenerCarusel,
    agregarCarusel,
    editarCarusel,
    eliminarCarusel } = require('../controllers/carrusel.controllers');
//LLAMAMOS NUESTRO METODO DE VERIFICAR TOKEN.
const { TokenTrue } = require('../middlewares/auth');
const { validadorCarrusel } = require('../validators/carrusel.validators');
//INSTACIA DE NUESTRA ROUTER DE EXPRESS
const router = Router();
//RUTAS DE PAISES
router.get('/', obtenerCaruselTodos);
router.post('/', TokenTrue, [validadorCarrusel], agregarCarusel);
router.get('/:id', obtenerCarusel);
router.put('/:id',TokenTrue, editarCarusel);
router.delete('/:id',TokenTrue, eliminarCarusel);
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = router;