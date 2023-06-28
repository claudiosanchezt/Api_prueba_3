// Obtenemos el metodo Router de express
const database = require('./../config/basedatos');
const { httpError } = require('./../utils/error')
const { matchedData } = require('express-validator');
const { obtenerData } = require('../middlewares/auth');
//CONTROLADORES
const obtenerPaises = async (req, res) => {
    //try {
        const db = await database();
        //  METODO PARA OBTENER TODAS LOS PAISES
        const sql = `
            SELECT 
                p.id_pais,
                p.nombre,
                p.url_imagen,
                p.fecha_creacion,
                CASE p.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM pais p
        `;
        //EJECUTAMOS LA CONSULTA
        const [rows] = await db.query(sql);
        //RETORNAMOS LA RESPUESTA
        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    //} catch (error) {
    //    httpError(res, "ERROR_GET_PAISES");
    //}
}
//  METODO PARA AGREGAR UNA PAIS
const agregarPais = async (req, res) => {

    try {
        const body = matchedData(req);
        const { nombre, url_imagen, estado } = req.body;
        const token = req.headers.authorization;
        const { usuario } = obtenerData(token.split(" ").pop());
        const id_usuario = usuario.id;
        const db = await database();

        const sql = `
            INSERT INTO pais(nombre, url_imagen, estado, id_usr, fecha_creacion)
            VALUES('${nombre}', '${url_imagen}', ${estado}, ${id_usuario}, NOW())
        `;
        const [resultado] = await db.query(sql);
        if (!resultado.insertId) {
            return res.json(
                {
                    "ok": false,
                    "msj": "no creaste nada del Pais"
                }
            );
        }

        res.json(
            {
                "ok": true
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_POST_PAIS", error)
    }

}

const obtenerPais = async (req, res) => {
    try {
        const { id } = req.params;

        const db = await database();

        const sql = `
        SELECT 
                p.id_pais,
                p.nombre,
                p.url_imagen,
                p.fecha_creacion,
                CASE p.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM pais p
        WHERE p.id_pais = ${id}
    `;
       //EJECUTAMOS LA CONSULTA 
       const [rows] = await db.query(sql);
        //
       res.json(
           {
               "ok": true,
               data: rows
           }
       );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DEL-PAIS")
    }
}
// Metodos para buscar por nombre
const obtenerPaisNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();

        const sql = `
        SELECT 
                p.id_pais,
                p.nombre,
                p.url_imagen,
                p.fecha_creacion,
                CASE p.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM pais p
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
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DEL-PAIS-POR-NOMBRE")
    }
}
// Metodos para editar
const editarPais = async (req, res) => {

    try {
        const { id } = req.params;
        const { nombre, estado } = req.body;
        const db = await database();
        const sql = `
            UPDATE pais SET
                nombre = '${nombre}',
                estado = ${estado}
            WHERE id_pais = ${id}
        `;
        //EJECUTAMOS LA CONSULTA
        const [resultado] = await db.query(sql);
        if (!resultado.affectedRows) {
            return httpError(res, "Error al Editar Pais");
        }
        //RETORNAMOS LA RESPUESTA
        return res.json({
            "ok": true,
            "msj": "Se edito correctamente  la Receta"
        });
    } catch (error) {
        return httpError(res, "Ocurrio algo en PUT Pais");
    }
}
// Metodos para eliminar
const eliminarPais = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await database();
        const sql = `DELETE FROM pais WHERE id_pais = ${id}`;
        const [resultado] = await db.query(sql);

        if (!resultado.affectedRows) {
            return httpError(res, "No se pudo eliminar nada del Pais");
        }

        return res.json({
                "ok": true,
                "msj": "El pais fue eliminada correctamente"
            });

    } catch (error) {
        return httpError(res, "ERROR EN DELETE PAIS");
    }
}
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = {  
    obtenerPaises,
    agregarPais,
    obtenerPais,
    obtenerPaisNombre,
    editarPais,
    eliminarPais           
}