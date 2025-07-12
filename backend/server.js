// backend/server.js

const express = require("express");
const { testConnection, pool } = require("./db");
const cors = require("cors"); // <-- 1. ASEGÚRATE DE QUE ESTA LÍNEA EXISTA

const app = express();
const port = 3000;

app.use(cors()); // <-- 2. ¡ESTA ES LA LÍNEA CLAVE! Debe estar aquí, antes de las rutas.

// Probamos la conexión al iniciar el servidor
testConnection();

// El endpoint que responde a la petición del frontend
app.get("/api/suscriptores", async (req, res) => {
    try {
        const sql = `
    SELECT 
        ec.szNombre AS estado,
        p.szPrimerNombre,
        p.szSegundoNombre,
        p.szPrimerApellido,
        p.szSegundoApellido,
        s.szCodigoCliente AS nuid,
        td.szNombrel AS tipo_documento,
        p.szNumeroDocumento AS identificacion,
        s.nEstratoSocioeconomico AS estrato,
        s.szDireccionServicio AS direccion,
        p.szTelefonoPrincipal AS telefono,
        GROUP_CONCAT(m.szNumeroSerie SEPARATOR ', ') AS numero_medidor
    FROM tblsuscriptor AS s
    INNER JOIN tblpersona AS p ON s.fkIdPersona = p.pkIdPersona
    INNER JOIN tblestadocliente AS ec ON s.fkIdEstadoCliente = ec.pkIdEstadoCliente
    INNER JOIN tbltipodocumento AS td ON p.fkIdTipoDocumento = td.pkIdTipoDocumento
    LEFT JOIN tblmedidor AS m ON s.pkIdSuscriptor = m.fkIdSuscriptor
    GROUP BY 
        s.pkIdSuscriptor, 
        p.pkIdPersona, 
        ec.szNombre, 
        td.szNombrel, 
        s.szCodigoCliente, 
        s.nEstratoSocioeconomico, 
        s.szDireccionServicio
    ORDER BY p.szPrimerApellido, p.szPrimerNombre, s.szCodigoCliente;
`;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener los datos.",
        });
    }
});

app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
