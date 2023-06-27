// Obtenemos el metodo Router de express
const database = require('../config/basedatos');
const { httpError } = require('../utils/error');
const { obtenerData } = require('../middlewares/auth');
//CONTROLADORES
const obtenerCategorias = async (req, res) => {
    try {
        const db = await database();
        //  METODO PARA OBTENER TODAS LOS PAISES
        const sql = `
            SELECT 
                c.id_cat,
                c.nombre,
                c.fecha_creacion,
                CASE c.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado                
            FROM categoria c
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
        httpError(res, "ERROR_GET_CATETORIAS");
    }
}
//  METODO PARA AGREGAR UNA PAIS
const agregarCategoria = async (req, res) => {

    try {
        const { nombre, estado } = req.body;
        const token = req.headers.authorization;
        const { usuario } = obtenerData(token.split(" ").pop());
        const id_usuario = usuario.id;
        const db = await database();

        const sql = `
            INSERT INTO categoria(nombre, estado, fecha_creacion, id_usr)
            VALUES('${nombre}', '${estado}', NOW(), ${id_usuario})
        `;
        // EJECUTAMOS LA CONSULTA 
        const [resultado] = await db.query(sql);
        if (!resultado.insertId) {
            return res.json(
                {
                    "ok": false,
                    "msj": "no creaste nada de la Categoria"
                }
            );
        }
        res.json(
            {
                "ok": true
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_POST_CATETORIAS")
    }
}
//  METODO PARA OBTENER UNA PAIS
const obtenerCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const db = await database();

        const sql = `
        SELECT 
                c.id_cat,
                c.nombre,
                c.fecha_creacion,
                CASE c.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado                
            FROM categoria c
        WHERE c.id_cat = ${id}
    `;

        const [rows] = await db.query(sql);

        res.json(
            {
                "ok": true,
                data: rows
            }
        );
    } catch (error) {
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-CATEGORIA")
    }
}
//  METODO PARA OBTENER UNA CATEGORIA POR NOMBRE
const obtenerCategoriaNombre = async (req, res) => {
    try {
        const { name } = req.params;
        const db = await database();

        const sql = `
        SELECT 
                c.id_cat,
                c.nombre,
                c.fecha_creacion,
                CASE c.estado
                    WHEN 1 THEN 'Activo'
                    ELSE 'Inactivo'
                END AS estado
            FROM categoria c
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
        return httpError(res, "ERROR_GET_UN_SOLO_DATO-DE-LA-CATEGORIA-POR-NOMBRE")
    }
}
// Metodos para editar
const editarCategoria = async (req, res) => {

    try {
        const { id } = req.params;
        const { nombre, estado} = req.body;
        const db = await database();
        const sql = `
            UPDATE categoria SET
                nombre = '${nombre}',
                estado = ${estado}
            WHERE id_cat = ${id}
        `;
        //EJECUTAMOS LA CONSULTA
        const [resultado] = await db.query(sql);
        if (!resultado.affectedRows) {
            return httpError(res, "Error al Editar Categoria");
        }
        //RETORNAMOS LA RESPUESTA
        return res.json({
            "ok": true,
            "msj": "Se edito correctamente  la Categoria"
        });
    } catch (error) {
        return httpError(res, "Ocurrio algo en PUT Categoria");
    }
}
// Metodos para eliminar
const eliminarCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        const db = await database();
        const sql = `DELETE FROM categoria WHERE id_cat = ${id}`;
        const [resultado] = await db.query(sql);

        if (!resultado.affectedRows) {
            return httpError(res, "No se pudo eliminar nada de la Categoria");
        }

        return res.json(
            {
                "ok": true,
                "msj": "Categoria fue eliminada correctamente"
            }
        )

    } catch (error) {
        return httpError(res, "ERROR EN DELETE CATEGORIA");
    }
}
//EXPORTA NUESTRA RUTA PARA NUESTRO INDEX.JS
module.exports = {  
    obtenerCategorias,
    agregarCategoria,
    obtenerCategoria,
    obtenerCategoriaNombre,
    editarCategoria,
    eliminarCategoria           
}