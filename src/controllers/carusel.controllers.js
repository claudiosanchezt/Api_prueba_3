// Obtenemos el metodo Router de express
const database = require('../config/basedatos');
const { httpError } = require('../utils/error')
const { matchedData } = require('express-validator');
const { obtenerData } = require('../middlewares/auth');
//CONTROLADORES
const obtenerCaruselTodos = async (req, res) => {
    try {
        const db = await database();
        //  METODO PARA OBTENER TODAS LOS CARRUSELES
        const sql = `
            SELECT 
                c.id_caru,
                c.nombre,
                c.url_imagen,
                c.fecha_creacion,
                CASE c.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM carrusel c
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
    } catch (error) {
        httpError(res, "ERROR_GET_PAISES");
    }
}
//  METODO PARA AGREGAR UNA PAIS
const agregarCarusel = async (req, res) => {

    try {
        const body = matchedData(req);
        const { nombre, url_imagen, estado } = req.body;
        const token = req.headers.authorization;
        const { usuario } = obtenerData(token.split(" ").pop());
        const id_usuario = usuario.id;
        const db = await database();

        const sql = `
            INSERT INTO carrusel (nombre, url_imagen, estado, id_usr, fecha_creacion)
            VALUES('${nombre}', '${url_imagen}', ${estado}, ${id_usuario}, NOW())
        `;
        const [resultado] = await db.query(sql);
        if (!resultado.insertId) {
            return res.json(
                {
                    "ok": false,
                    "msj": "no creaste nada del Carrusel"
                }
            );
        }

        res.json(
            {
                "ok": true
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_POST_CARRUSEL", error)
    }

}

const obtenerCarusel = async (req, res) => {
    try {
        const { id } = req.params;

        const db = await database();

        const sql = `
        SELECT 
                c.id_caru,
                c.nombre,
                c.url_imagen,
                c.fecha_creacion,
                CASE c.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM carrusel c
        WHERE c.id_caru = ${id}
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
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DEL-CARRUSEL-POR-ID")
    }
}
// Metodos para editar
const editarCarusel = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, estado } = req.body;
        const db = await database();
        const sql = `
            UPDATE carrusel SET
                nombre = '${nombre}',
                estado = ${estado}
            WHERE id_caru = ${id}
        `;
        //EJECUTAMOS LA CONSULTA
        const [resultado] = await db.query(sql);
        if (!resultado.affectedRows) {
            return httpError(res, "Error al Editar el Carrusel");
        }
        //RETORNAMOS LA RESPUESTA
        return res.json({
            "ok": true,
            "msj": "Se edito correctamente  el Carrusel"
        });
    } catch (error) {
        return httpError(res, "Ocurrio algo en PUT Carrusel");
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