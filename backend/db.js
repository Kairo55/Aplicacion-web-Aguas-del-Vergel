// backend/db.js
require("dotenv").config(); // Carga las variables de entorno del archivo .env
const mysql = require("mysql2/promise");

// Crear el pool de conexiones usando variables de entorno
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Función para probar la conexión
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ ¡Conexión a la base de datos db_acueducto exitosa! ✅");
        connection.release(); // Libera la conexión de vuelta al pool
        return true;
    } catch (error) {
        console.error(
            "❌ Error al conectar con la base de datos:",
            error.message
        );
        return false;
    }
}

// Exportamos el pool para usarlo en otras partes y la función de test
module.exports = { pool, testConnection };
