// backend/server.js

const express = require("express");
const { testConnection, pool } = require("./db");
const cors = require("cors");

const app = express();
app.disable("etag");
const port = 3000;

app.use(cors());
app.use(express.json()); //LÍNEA para procesar JSON
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
        s.szNombrePredio AS nombre_predio,
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
        s.szNombrePredio,
        p.szTelefonoPrincipal
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

// ENDPOINT para obtener los detalles de UN solo suscriptor por su NUID
app.get("/api/suscriptor/:nuid", async (req, res) => {
    const { nuid } = req.params;
    try {
        const sql = `
            SELECT 
                s.szCodigoCliente AS nuid,
                s.szNumeroContrato,
                s.szDireccionServicio,
                s.szNombrePredio,
                s.nEstratoSocioeconomico,
                s.szClaseUso,
                s.fkIdEstadoCliente,
                p.*,
                (SELECT GROUP_CONCAT(pkIdTipoDocumento,':',szNombrel SEPARATOR ';') FROM tbltipodocumento) AS tipos_documento,
                (SELECT GROUP_CONCAT(pkIdEstadoCliente,':',szNombre SEPARATOR ';') FROM tblestadocliente) AS estados_cliente
            FROM tblsuscriptor AS s
            INNER JOIN tblpersona AS p ON s.fkIdPersona = p.pkIdPersona
            WHERE s.szCodigoCliente = ?;
        `;
        const [rows] = await pool.query(sql, [nuid]);

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Suscriptor no encontrado." });
        }
    } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

// --- INICIO: NUEVO ENDPOINT PARA ACTUALIZAR SUSCRIPTOR (PUT) ---
app.put("/api/suscriptor/:nuid", async (req, res) => {
    const { nuid } = req.params;
    const data = req.body;
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [suscriptorRows] = await connection.query(
            "SELECT fkIdPersona FROM tblsuscriptor WHERE szCodigoCliente = ?",
            [nuid]
        );

        if (suscriptorRows.length === 0) {
            throw new Error("Suscriptor no encontrado para actualizar.");
        }
        const personaId = suscriptorRows[0].fkIdPersona;

        // 2. Actualizar la tabla tblpersona
        const personaSql = `
            UPDATE tblpersona SET 
                fkIdTipoDocumento = ?, szNumeroDocumento = ?, dtFechaExpedicion = ?, 
                szPrimerNombre = ?, szSegundoNombre = ?, szPrimerApellido = ?, 
                szSegundoApellido = ?, szApellidoCasada = ?, szEmail = ?, 
                szTelefonoPrincipal = ?, szTelefonoSecundario = ?
            WHERE pkIdPersona = ?;
        `;
        await connection.query(personaSql, [
            data.tipoDocumento,
            data.numeroDocumento,
            data.fechaExpedicion,
            data.primerNombre,
            data.segundoNombre,
            data.primerApellido,
            data.segundoApellido,
            data.apellidoCasada,
            data.email,
            data.telefonoPrincipal,
            data.telefonoSecundario,
            personaId,
        ]);

        // 3. Actualizar la tabla tblsuscriptor
        const suscriptorSql = `
            UPDATE tblsuscriptor SET 
                szNumeroContrato = ?, szDireccionServicio = ?, szNombrePredio = ?, 
                nEstratoSocioeconomico = ?, szClaseUso = ?, fkIdEstadoCliente = ?
            WHERE szCodigoCliente = ?;
        `;
        await connection.query(suscriptorSql, [
            data.numeroContrato,
            data.direccionServicio,
            data.nombrePredio,
            data.estrato,
            data.claseUso,
            data.estadoCliente,
            nuid,
        ]);

        // --- INICIO: REGISTRO DE AUDITORÍA ---
        const auditSql = `
            INSERT INTO tblauditoria (fkIdUsuario, szTipoEvento, szModuloAfectado, szIdRegistroAfectado, txDetalleCambio) 
            VALUES (?, ?, ?, ?, ?);
        `;
        const detalleCambio = `Se actualizaron los datos del suscriptor.`;
        // NOTA: El ID de usuario (1) es un valor temporal.
        await connection.query(auditSql, [
            1,
            "Actualización",
            "Suscriptores",
            nuid,
            detalleCambio,
        ]);
        // --- FIN: REGISTRO DE AUDITORÍA ---

        await connection.commit();
        res.json({ message: "Suscriptor actualizado exitosamente." });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al actualizar el suscriptor:", error);
        res.status(500).json({
            message: "Error interno del servidor al guardar los cambios.",
        });
    } finally {
        if (connection) connection.release();
    }
});

// --- FIN: NUEVO ENDPOINT ---

app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
