// Obtenemos el metodo Router de express
const database = require('../config/basedatos');
const { httpError } = require('../utils/error');
const { obtenerData } = require('../middlewares/auth');
const { matchedData } = require('express-validator');
//CONTROLADORES
const obtenerRecetas = async (req, res) => {

    try {
        const db = await database();

        const sql = `
        SELECT 
                r.id_receta,
                r.nombre,
                r.url_imagen,
                r.ingrediente,
                r.preparacion,
                r.id_cat,
                c.nombre as nombre_cat,
                r.id_pais,
                p.nombre as nombre_pais,    
                r.fecha_creacion,
                CASE r.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado,
                u.id_usr,
                CONCAT(u.nombre, ' ', u.apellido) as nombre_y_apellido
            FROM receta r
            INNER JOIN usuario u ON u.id_usr = r.id_usr
            INNER JOIN categoria c ON c.id_cat = r.id_cat
            INNER JOIN pais p ON p.id_pais = r.id_pais
        `;

        const [rows] = await db.query(sql);

        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        httpError(res, "ERROR_GET_RECETAS");
    }
}
//  METODO PARA AGREGAR UNA RECETA
const agregarReceta = async (req, res) => {

    try {
        const body = matchedData(req);
        const { nombre, url_imagen, ingrediente, preparacion, estado, id_cat, id_pais } = req.body;
        const token = req.headers.authorization;
        const { usuario } = obtenerData(token.split(" ").pop());
        const id_usuario = usuario.id;
        const db = await database();
        const sql = `
            INSERT INTO receta(nombre, url_imagen, ingrediente, preparacion, estado, id_cat, id_pais, fecha_creacion, id_usr)
            VALUES('${nombre}', '${url_imagen}', '${ingrediente}', '${preparacion}', ${estado}, ${id_cat}, ${id_pais}, NOW(), ${id_usuario})
        `;
        const [resultado] = await db.query(sql);
        if (!resultado.insertId) {
            return res.json(
                {
                    "ok": false,
                    "msj": "no creaste nada de la Receta"
                }
            );
        }
        res.json(
            {
                "ok": true
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_POST_RECETA",error)
    }
}
//  METODO PARA OBTENER UNA RECETA POR NOMBRE 
const obtenerRecetaNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();
        const sql = `
        SELECT 
                r.id_receta,
                r.nombre,
                r.url_imagen,
                r.ingrediente,
                r.preparacion,
                r.id_cat,
                c.nombre as nombre_cat,
                r.id_pais,
                p.nombre as nombre_pais,
                r.fecha_creacion,
                CASE r.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado,
                u.id_usr,
                CONCAT(u.nombre, ' ', u.apellido) as nombre_y_apellido
            FROM receta r
            INNER JOIN usuario u ON u.id_usr = r.id_usr
            INNER JOIN categoria c ON c.id_cat = r.id_cat
            INNER JOIN pais p ON p.id_pais = r.id_pais
        WHERE r.nombre like '${name}%'
    `;
        const [rows] = await db.query(sql);
        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_DATO-DE-LA-RECETA-POR-NOMBRE")
    }
}
//  METODO PARA OBTENER UNA RECETA POR ID 
const obtenerReceta = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await database();
        const sql = `
        SELECT 
                r.id_receta,
                r.nombre,
                r.url_imagen,
                r.ingrediente,
                r.preparacion,
                r.id_cat,
                c.nombre as nombre_cat,
                r.id_pais,
                p.nombre as nombre_pais,
                r.fecha_creacion,
                CASE r.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado,
                u.id_usr,
                CONCAT(u.nombre, ' ', u.apellido) as nombre_y_apellido
            FROM receta r
            INNER JOIN usuario u ON u.id_usr = r.id_usr
            INNER JOIN categoria c ON c.id_cat = r.id_cat
            INNER JOIN pais p ON p.id_pais = r.id_pais
        WHERE r.id_receta = ${id}
    `;
        const [rows] = await db.query(sql);
        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_DATO-DE-LA-RECETA")
    }
}
//  METODO PARA OBTENER UNA CATEGORIA POR NOMBRE
const obtenerRecetaCategoriaNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();
        const sql = `
        SELECT 
                r.id_receta,
                r.nombre,
                r.url_imagen,
                r.ingrediente,
                r.preparacion,
                r.id_cat,
                c.nombre as nombre_cat,
                r.id_pais,
                p.nombre as nombre_pais,
                r.fecha_creacion,
                CASE r.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM receta r
            INNER JOIN categoria c ON c.id_cat = r.id_cat
            INNER JOIN pais p ON p.id_pais = r.id_pais
        WHERE c.nombre like '${name}%'

    `;
       //EJECUTAMOS LA CONSULTA 
       const [rows] = await db.query(sql);
       res.json(
           {
               "ok": true,
               data: rows
           }
       );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DE-LA-RECETA-BUSQUEDA-POR-CATEGORIA-POR-NOMBRE")
    }
}
//  METODO PARA OBTENER UN PAIS POR NOMBRE
const obtenerRecetaPaisNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();

        const sql = `
        SELECT 
                r.id_receta,
                r.nombre,
                r.url_imagen,
                r.ingrediente,
                r.preparacion,
                r.id_cat,
                c.nombre as nombre_cat,
                r.id_pais,
                p.nombre as nombre_pais,
                r.fecha_creacion,
                CASE r.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM receta r
            INNER JOIN pais p ON p.id_pais = r.id_pais
            INNER JOIN categoria c ON c.id_cat = r.id_cat
        WHERE p.nombre like '${name}%'

    `;
       //EJECUTAMOS LA CONSULTA 
       const [rows] = await db.query(sql);
       res.json(
           {
               "ok": true,
               data: rows
           }
       );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DE-LA-RECETA-BUSQUEDA-POR-CATEGORIA-POR-NOMBRE")
    }
}
//  METODO PARA EDITAR UNA RECETA
const editarReceta = async (req, res) => {

    try {
        const { id } = req.params;
        const body = matchedData(req);
        const { nombre, url_imagen, ingrediente, preparacion, estado, id_cat, id_pais } = req.body;
        const db = await database();
        const sql = `
            UPDATE receta SET
                nombre = '${nombre}',
                url_imagen = '${url_imagen}',
                ingrediente = '${ingrediente}',
                preparacion = '${preparacion}',
                estado = ${estado},
                id_cat = '${id_cat}',
                id_pais = '${id_pais}'
            WHERE id_receta = ${id}
        `;
        //EJECUTAMOS LA CONSULTA
        const [resultado] = await db.query(sql);        
        if (!resultado.affectedRows) {
            return httpError(res, "Error al Editar Receta");
        }
        //RETORNAMOS LA RESPUESTA
        return res.json({
            "ok": true,
            "msj": "Se edito correctamente  la Receta"
        });

    } catch (error) {
        return httpError(res, "Error al editar Receta");
    }
}
// METODO PARA ELIMINAR UNA RECETA
const eliminarReceta = async (req, res) => {
    try {
        const { id } = req.params;

        const db = await database();
        const sql = `DELETE FROM receta WHERE id_receta = ${id}`;
        const [resultado] = await db.query(sql);

        if (!resultado.affectedRows) {
            return httpError(res, "No se pudo eliminar nada de la Receta");
        }

        return res.json(
            {
                "ok": true,
                "msj": "Receta fue eliminada correctamente"
            }
        )

    } catch (error) {
        return httpError(res, "ERROR EN DELETE RECETA");
    }
}
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = {  
    obtenerRecetas,
    agregarReceta,
    obtenerReceta,
    obtenerRecetaNombre,
    obtenerRecetaCategoriaNombre,
    obtenerRecetaPaisNombre,
    editarReceta,
    eliminarReceta           
}