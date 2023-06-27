//  Importamos el validador de express
const { check } = require('express-validator');
const { validadorResultado } = require('../utils/validacion');
// Validar los datos de entrada de las peticiones
const validadorRecetas = [
    check('nombre')
        .exists().withMessage("Favor ingresar nombre de la receta")
        .notEmpty().withMessage("Favor este campo no puede venir vacio")
        .isLength({min: 3, max: 64}).withMessage("Favor este campo debe etnner un minimo de 3 y un maximo 64"),
    check('url_imagen')
        .exists().withMessage("Favor ingresar descripcion en JSON")
        .notEmpty().withMessage("Favor este campo no puede venir vacio"),
    check('estado')
        .exists().withMessage("Favor ingresar estado en JSON")
        .notEmpty().withMessage("Favor este campo no puede venir vacio")
        .isInt({min: 0, max: 1}).withMessage("Favor solo debe ingresar si 1 o 0"),
    check('ingrediente')
        .exists().withMessage("Favor ingresar ingrediente en JSON")
        .notEmpty().withMessage("Favor este campo no puede venir vacio"),
    check('preparacion')
        .exists().withMessage("Favor ingresar preparacion en JSON")
        .notEmpty().withMessage("Favor este campo no puede venir vacio"),
    check('id_cat')
        .exists().withMessage("Favor ingresar categoria en JSON")
        .notEmpty().withMessage("Favor este campo no puede venir vacio")
        .isInt({min: 1}).withMessage("Favor solo debe ingresar numeros"),
    check('id_pais')
        .exists().withMessage("Favor ingresar pais en JSON")
        .notEmpty().withMessage("Favor este campo no puede venir vacio")
        .isInt({min: 1}).withMessage("Favor solo debe ingresar numeros"),
    (req, res, next) => {
        return validadorResultado(req, res, next);
    }
];
//  Exportamos el validador
module.exports = {
    validadorRecetas
}