const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

// Configuracion de la base de datos
const configDatabase = {
    host: process.env.HOST,
    user: process.env.USERDATABASE,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};
const mysql = require('mysql2/promise');

const createDbConnection = async () => {
    try {
        const connection = await mysql.createConnection(configDatabase);
        console.log('Conexión exitosa a la base de datos',connection);
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        throw error;
    }
};

module.exports = createDbConnection;