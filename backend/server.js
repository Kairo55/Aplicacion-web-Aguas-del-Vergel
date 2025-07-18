// backend/server.

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

// =============================================
//  EDPOINT  LISTA DE REGISTAR LECTURAS
// =============================================
app.get("/api/suscriptores-para-lectura", async (req, res) => {
    try {
        const sql = `
            SELECT 
                s.szCodigoCliente AS nuid,
                p.szPrimerNombre,
                p.szSegundoNombre,
                p.szPrimerApellido,
                p.szSegundoApellido,
                p.szNumeroDocumento,
                c.szNombreCiclo AS ciclo, -- Columna del ciclo añadida
                s.nEstratoSocioeconomico AS estrato,
                s.szDireccionServicio AS direccion,
                p.szTelefonoPrincipal AS celular,
                (SELECT l.dcValorLectura 
                 FROM tbllectura l 
                 JOIN tblfactura f ON l.pkIdLectura = f.fkIdLecturaActual
                 WHERE f.fkIdSuscriptor = s.pkIdSuscriptor 
                 ORDER BY l.dtFechaLectura DESC LIMIT 1) AS ultimaMedicion
            FROM tblsuscriptor s
            JOIN tblpersona p ON s.fkIdPersona = p.pkIdPersona
            LEFT JOIN tblciclofacturacion c ON s.fkIdCiclo = c.pkIdCiclo -- JOIN con la tabla de ciclos
            WHERE s.fkIdEstadoCliente = 1; -- Solo suscriptores activos
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener suscriptores para lectura:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
// =============================================
//  FIN EDPOINT LISTA DE REGISTAR LECTURAS
// =============================================

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

// =============================================
//  INICIO: ENDPOINTS PARA MICROMEDICIÓN
// =============================================

// 1. Endpoint para OBTENER la última lectura de un suscriptor para el modal
app.get("/api/medidor/:nuid/ultima-lectura", async (req, res) => {
    const { nuid } = req.params;
    try {
        // Primero, obtenemos el medidor activo para el suscriptor
        // MODIFICACIÓN: Añadir m.szNumeroSerie a la consulta
        const medidorSql = `
            SELECT 
                m.pkIdMedidor, 
                m.szNumeroSerie as numeroMedidorActual,
                CONCAT(p.szPrimerNombre, ' ', p.szPrimerApellido) AS nombreSuscriptor
            FROM tblmedidor m
            JOIN tblsuscriptor s ON m.fkIdSuscriptor = s.pkIdSuscriptor
            JOIN tblpersona p ON s.fkIdPersona = p.pkIdPersona
            WHERE s.szCodigoCliente = ? AND m.bActivoParaFacturacion = 1;
        `;
        const [medidores] = await pool.query(medidorSql, [nuid]);

        if (medidores.length === 0) {
            return res.status(404).json({
                message:
                    "No se encontró un medidor activo para este suscriptor.",
            });
        }

        const idMedidor = medidores[0].pkIdMedidor;
        const nombreSuscriptor = medidores[0].nombreSuscriptor;
        const numeroMedidorActual = medidores[0].numeroMedidorActual; // <-- CAPTURAR NUEVO DATO

        // Luego, buscamos la lectura más reciente para ese medidor
        const lecturaSql = `
            SELECT dcValorLectura 
            FROM tbllectura 
            WHERE fkIdMedidor = ? 
            ORDER BY dtFechaLectura DESC, pkIdLectura DESC 
            LIMIT 1;
        `;
        const [lecturas] = await pool.query(lecturaSql, [idMedidor]);

        const lecturaAnterior =
            lecturas.length > 0 ? lecturas[0].dcValorLectura : 0;

        // MODIFICACIÓN: Añadir numeroMedidorActual a la respuesta JSON
        res.json({
            idMedidor,
            nombreSuscriptor,
            lecturaAnterior,
            numeroMedidorActual, // <-- AÑADIR DATO A LA RESPUESTA
        });
    } catch (error) {
        console.error("Error al obtener la última lectura:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

// 2. Endpoint para GUARDAR una nueva lectura
app.post("/api/lecturas", async (req, res) => {
    const { idMedidor, lecturaActual, fechaLectura } = req.body;
    // Validaciones básicas
    if (!idMedidor || lecturaActual === undefined || !fechaLectura) {
        return res.status(400).json({ message: "Faltan datos requeridos." });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Insertar la nueva lectura
        const periodoConsumo = new Date(fechaLectura).toISOString().slice(0, 7); // Formato YYYY-MM
        const insertLecturaSql = `
            INSERT INTO tbllectura (fkIdMedidor, dtFechaLectura, dcValorLectura, szPeriodoConsumo, szTipoLectura, szIngresadoPor)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [result] = await connection.query(insertLecturaSql, [
            idMedidor,
            fechaLectura,
            lecturaActual,
            periodoConsumo,
            "Manual", // Tipo de lectura
            "Admin Panel", // Usuario o sistema que ingresa el dato
        ]);

        const newLecturaId = result.insertId;

        // Registrar en la auditoría
        const auditSql = `
            INSERT INTO tblauditoria (fkIdUsuario, szTipoEvento, szModuloAfectado, szIdRegistroAfectado, txDetalleCambio) 
            VALUES (?, ?, ?, ?, ?);
        `;
        const detalleCambio = `Se registró una nueva lectura de ${lecturaActual} para el medidor ID ${idMedidor}.`;
        await connection.query(auditSql, [
            1,
            "Creación",
            "Micromedición",
            newLecturaId,
            detalleCambio,
        ]);

        await connection.commit();
        res.status(201).json({ message: "Lectura registrada exitosamente." });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al registrar la lectura:", error);
        res.status(500).json({
            message: "Error interno del servidor al registrar la lectura.",
        });
    } finally {
        if (connection) connection.release();
    }
});

// =============================================
//  INICIO: NUEVO ENDPOINT PARA LISTAR LECTURAS
// =============================================
app.get("/api/lecturas", async (req, res) => {
    try {
        const sql = `
            SELECT 
                l.pkIdLectura, -- ID único de la lectura
                p.szPrimerNombre,
                p.szSegundoNombre,
                p.szPrimerApellido,
                p.szSegundoApellido,
                s.szCodigoCliente AS nuid,
                p.szNumeroDocumento,
                c.szNombreCiclo AS ciclo,
                m.szNumeroSerie AS numeroContador,
                l.dcValorLectura AS lectura,
                (l.dcValorLectura - LAG(l.dcValorLectura, 1, 0) OVER (PARTITION BY l.fkIdMedidor ORDER BY l.dtFechaLectura, l.pkIdLectura)) AS consumo,
                l.dtFechaLectura AS fechaLectura,
                l.szPeriodoConsumo
            FROM tbllectura l
            JOIN tblmedidor m ON l.fkIdMedidor = m.pkIdMedidor
            JOIN tblsuscriptor s ON m.fkIdSuscriptor = s.pkIdSuscriptor
            JOIN tblpersona p ON s.fkIdPersona = p.pkIdPersona
            LEFT JOIN tblciclofacturacion c ON s.fkIdCiclo = c.pkIdCiclo
            WHERE l.bAnulada = 0 -- ¡IMPORTANTE! Solo trae lecturas válidas
            ORDER BY l.szPeriodoConsumo DESC, c.szNombreCiclo, p.szPrimerApellido;
        `;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener el historial de lecturas:", error);
        res.status(500).json({
            message: "Error interno del servidor al obtener las lecturas.",
        });
    }
});

// 2. AÑADE este nuevo endpoint al final de la sección de Micromedición
// =============================================
//  ENDPOINT PARA ANULAR UNA LECTURA
// =============================================
app.put("/api/lecturas/:id/anular", async (req, res) => {
    const { id } = req.params;
    const idUsuario = 1; // Temporal: Debería venir del sistema de autenticación
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Marcar la lectura como anulada
        const updateSql =
            "UPDATE tbllectura SET bAnulada = 1 WHERE pkIdLectura = ?";
        const [updateResult] = await connection.query(updateSql, [id]);

        if (updateResult.affectedRows === 0) {
            throw new Error("La lectura no fue encontrada o ya fue anulada.");
        }

        // Registrar la acción en la auditoría
        const auditSql = `
            INSERT INTO tblauditoria (fkIdUsuario, szTipoEvento, szModuloAfectado, szIdRegistroAfectado, txDetalleCambio) 
            VALUES (?, 'Anulación', 'Micromedición', ?, ?);
        `;
        const detalle = `El usuario ${idUsuario} anuló el registro de lectura con ID ${id}.`;
        await connection.query(auditSql, [idUsuario, id, detalle]);

        await connection.commit();
        res.json({ message: "Lectura anulada correctamente." });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al anular la lectura:", error);
        res.status(500).json({
            message: "Error interno del servidor al anular la lectura.",
        });
    } finally {
        if (connection) connection.release();
    }
});
// =============================================
//  FIN: ENDPOINT PARA ANULAR LECTURAS
// =============================================

// =============================================
//  INICIO: ENDPOINT PARA OBTENER UNA LECTURA POR ID
// =============================================
app.get("/api/lecturas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Obtenemos la lectura actual
        const [lecturaActualRows] = await pool.query(
            "SELECT * FROM tbllectura WHERE pkIdLectura = ?",
            [id]
        );
        if (lecturaActualRows.length === 0) {
            return res.status(404).json({ message: "Lectura no encontrada." });
        }
        const lecturaActual = lecturaActualRows[0];

        // Buscamos la lectura anterior para el mismo medidor
        const [lecturaAnteriorRows] = await pool.query(
            `SELECT dcValorLectura 
             FROM tbllectura 
             WHERE fkIdMedidor = ? AND dtFechaLectura < ? AND bAnulada = 0
             ORDER BY dtFechaLectura DESC, pkIdLectura DESC 
             LIMIT 1`,
            [lecturaActual.fkIdMedidor, lecturaActual.dtFechaLectura]
        );
        const lecturaAnterior =
            lecturaAnteriorRows.length > 0
                ? lecturaAnteriorRows[0].dcValorLectura
                : 0;

        res.json({ ...lecturaActual, lecturaAnterior });
    } catch (error) {
        console.error("Error al obtener la lectura:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});
// =============================================
//  FIN: ENDPOINT PARA OBTENER UNA LECTURA POR ID
// =============================================

// =============================================
//  INICIO: ENDPOINT PARA ACTUALIZAR UNA LECTURA
// =============================================
app.put("/api/lecturas/:id", async (req, res) => {
    const { id } = req.params;
    const { dcValorLectura, dtFechaLectura } = req.body;
    const idUsuario = 1; // Temporal
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Obtener datos antiguos para auditoría y validación
        const [oldLecturaRows] = await connection.query(
            "SELECT * FROM tbllectura WHERE pkIdLectura = ?",
            [id]
        );
        if (oldLecturaRows.length === 0)
            throw new Error("Lectura no encontrada.");
        const oldLectura = oldLecturaRows[0];

        // 2. Validar que el nuevo valor no es mayor que una lectura posterior (si existe)
        const [nextLecturaRows] = await connection.query(
            `SELECT dcValorLectura FROM tbllectura WHERE fkIdMedidor = ? AND dtFechaLectura > ? AND bAnulada = 0 ORDER BY dtFechaLectura ASC, pkIdLectura ASC LIMIT 1`,
            [oldLectura.fkIdMedidor, oldLectura.dtFechaLectura]
        );

        if (
            nextLecturaRows.length > 0 &&
            dcValorLectura > nextLecturaRows[0].dcValorLectura
        ) {
            throw new Error(
                `El nuevo valor (${dcValorLectura}) no puede ser mayor que el valor de la siguiente lectura registrada (${nextLecturaRows[0].dcValorLectura}).`
            );
        }

        // 3. Actualizar la lectura
        const szPeriodoConsumo = new Date(dtFechaLectura)
            .toISOString()
            .slice(0, 7);
        const updateSql =
            "UPDATE tbllectura SET dcValorLectura = ?, dtFechaLectura = ?, szPeriodoConsumo = ? WHERE pkIdLectura = ?";
        await connection.query(updateSql, [
            dcValorLectura,
            dtFechaLectura,
            szPeriodoConsumo,
            id,
        ]);

        // 4. Registrar en auditoría
        const detalle = `Usuario ${idUsuario} editó lectura ID ${id}. Valor anterior: ${oldLectura.dcValorLectura}, Fecha anterior: ${oldLectura.dtFechaLectura}. Valor nuevo: ${dcValorLectura}, Fecha nueva: ${dtFechaLectura}.`;
        const auditSql =
            "INSERT INTO tblauditoria (fkIdUsuario, szTipoEvento, szModuloAfectado, szIdRegistroAfectado, txDetalleCambio) VALUES (?, 'Edición', 'Micromedición', ?, ?)";
        await connection.query(auditSql, [idUsuario, id, detalle]);

        await connection.commit();
        res.json({ message: "Lectura actualizada correctamente." });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al actualizar la lectura:", error);
        res.status(400).json({
            message: error.message || "Error interno del servidor.",
        });
    } finally {
        if (connection) connection.release();
    }
});
// =============================================
//  FIN: ENDPOINT PARA ACTUALIZAR UNA LECTURA
// =============================================

// =============================================
//  INICIO: ENDPOINT PARA CAMBIAR MEDIDOR
// =============================================
app.post("/api/medidores/cambiar", async (req, res) => {
    const { nuid, nuevoNumeroMedidor, lecturaInicial, fechaInstalacion } =
        req.body;
    let connection;

    if (!nuid || !nuevoNumeroMedidor || !fechaInstalacion) {
        return res.status(400).json({
            message:
                "Faltan datos requeridos (NUID, nuevo número de medidor, fecha de instalación).",
        });
    }

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [existingMeter] = await connection.query(
            "SELECT pkIdMedidor FROM tblmedidor WHERE szNumeroSerie = ?",
            [nuevoNumeroMedidor]
        );
        if (existingMeter.length > 0) {
            throw new Error(
                `El número de medidor '${nuevoNumeroMedidor}' ya existe en la base de datos.`
            );
        }

        const [suscriptorRows] = await connection.query(
            "SELECT pkIdSuscriptor FROM tblsuscriptor WHERE szCodigoCliente = ?",
            [nuid]
        );
        if (suscriptorRows.length === 0) {
            throw new Error("Suscriptor no encontrado.");
        }
        const idSuscriptor = suscriptorRows[0].pkIdSuscriptor;

        await connection.query(
            "UPDATE tblmedidor SET bActivoParaFacturacion = 0 WHERE fkIdSuscriptor = ? AND bActivoParaFacturacion = 1",
            [idSuscriptor]
        );

        // --- INICIO: CORRECCIÓN FINAL ---
        // Se añade la columna 'szEstadoMedidor' con un valor por defecto.
        const insertMedidorSql = `
            INSERT INTO tblmedidor (fkIdSuscriptor, szNumeroSerie, dtFechaInstalacion, bActivoParaFacturacion, szEstadoMedidor) 
            VALUES (?, ?, ?, 1, 'Instalado');
        `;
        const [resultMedidor] = await connection.query(insertMedidorSql, [
            idSuscriptor,
            nuevoNumeroMedidor,
            fechaInstalacion,
        ]);
        // --- FIN: CORRECCIÓN FINAL ---

        const newMedidorId = resultMedidor.insertId;

        if (parseFloat(lecturaInicial) >= 0) {
            const periodoConsumo = new Date(fechaInstalacion)
                .toISOString()
                .slice(0, 7);
            const insertLecturaSql = `
                INSERT INTO tbllectura (fkIdMedidor, dtFechaLectura, dcValorLectura, szPeriodoConsumo, szTipoLectura, szIngresadoPor)
                VALUES (?, ?, ?, ?, ?, ?);
            `;
            await connection.query(insertLecturaSql, [
                newMedidorId,
                fechaInstalacion,
                lecturaInicial,
                periodoConsumo,
                "Instalacion",
                "Admin Panel",
            ]);
        }

        const detalleCambio = `Cambio de medidor para suscriptor ${nuid}. Nuevo medidor: ${nuevoNumeroMedidor}.`;
        await connection.query(
            "INSERT INTO tblauditoria (fkIdUsuario, szTipoEvento, szModuloAfectado, szIdRegistroAfectado, txDetalleCambio) VALUES (?, ?, ?, ?, ?)",
            [1, "Actualización", "Micromedición", nuid, detalleCambio]
        );

        await connection.commit();
        res.status(201).json({
            message:
                "¡Éxito! El medidor ha sido cambiado y registrado correctamente.",
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error al cambiar el medidor:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message:
                    "Error: El número de medidor que intentas registrar ya existe.",
            });
        }

        if (error.message.includes("ya existe")) {
            return res.status(409).json({ message: error.message });
        }

        res.status(500).json({
            message: "Error interno del servidor al cambiar el medidor.",
        });
    } finally {
        if (connection) connection.release();
    }
});
// =============================================
//  FIN: ENDPOINT PARA CAMBIAR MEDIDOR
// =============================================

app.listen(port, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
