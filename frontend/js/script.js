// script.js CORREGIDO Y UNIFICADO

document.addEventListener("DOMContentLoaded", function () {
    // =============================================
    // === INICIALIZACIÓN DE COMPONENTES (FLATPICKR)
    // =============================================
    flatpickr("#pagoFecha", {
        locale: "es",
        dateFormat: "d-F-Y",
        defaultDate: "today",
    });
    flatpickr("#reporteDesde", { locale: "es", dateFormat: "d-F-Y" });
    flatpickr("#reporteHasta", { locale: "es", dateFormat: "d-F-Y" });
    flatpickr("#reporteGenDesde", { locale: "es", dateFormat: "d-F-Y" });
    flatpickr("#reporteGenHasta", { locale: "es", dateFormat: "d-F-Y" });
    flatpickr("#fecha-lectura", {locale: "es",dateFormat: "Y-m-d",defaultDate: "today"});
    flatpickr("#cambiar-fecha-instalacion", {locale: "es",dateFormat: "Y-m-d"});
    flatpickr("#edit-fecha-lectura", { locale: "es", dateFormat: "Y-m-d" });

    // =============================================
    // === DECLARACIÓN DE VARIABLES GLOBALES DEL DOM
    // =============================================
    const menuHamburguesa = document.querySelector(".menu-hamburguesa");
    const contenedorMenu = document.querySelector(".contenedor-menu");
    const allEncabezadoNav = document.querySelectorAll(".encabezado-nav");
    const allElementoNavSubmenu = document.querySelectorAll(".submenu .elemento-nav");
    const todasLasVistas = document.querySelectorAll(".vista-contenido");
    let elementoSeleccionadoGlobal = null;

    // --- Variables para Modales ---
    const modalNota = document.getElementById("modalAgregarNota");
    const botonesAgregarNota = document.querySelectorAll(".btn-agregar-nota");
    const modalNuidNota = document.getElementById("modalNuidNota");
    const modalNombreNota = document.getElementById("modalNombreNota");
    const modalSaldoNota = document.getElementById("modalSaldoNota");
    const modalFormNota = document.getElementById("formAgregarNota");
    const valorInputNota = document.getElementById("modalValor");
    const nuevoSaldoInput = document.getElementById("modalNuevoSaldo");
    let saldoNumericoActual = 0;

    const modalPago = document.getElementById("modalPagar");
    const botonesPagar = document.querySelectorAll(".btn-pagar");
    const modalNombrePagoHeader = document.getElementById(
        "modalNombrePagoHeader"
    );
    const modalSaldoPago = document.getElementById("modalSaldoPago");
    const modalFormPago = document.getElementById("formPagar");
    const pagoValorInput = document.getElementById("pagoValor");

    const todosLosModales = document.querySelectorAll(".modal");
    const todosLosBotonesCerrar = document.querySelectorAll(
        '[data-dismiss="modal"]'
    );

    // --- Variables para Comprobante de Pago ---
    const inputPeriodo = document.getElementById("periodo");
    const pickerBtn = document.querySelector(".month-picker-btn");
    const dropdown = document.querySelector(".month-picker-dropdown");
    const yearDisplay = dropdown.querySelector(".year-display");
    const prevYearBtn = dropdown.querySelector(".prev-year");
    const nextYearBtn = dropdown.querySelector(".next-year");
    const monthsGrid = dropdown.querySelector(".months-grid");
    const meses = [
        "ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic.",
    ];
    let currentYear = new Date().getFullYear();
    let selectedMonth = new Date().getMonth();

    // --- Variables para Comunicaciones y Edición de Suscriptor ---
    const modalEditar = document.getElementById("modalEditarSuscriptor");
    const formEditarSuscriptor = document.getElementById(
        "form-editar-suscriptor"
    );
    const tablaSuscriptoresBody = document.querySelector(
        "#vista-lista-suscriptores .unified-table tbody"
    );
    const formComunicado = document.getElementById("form-comunicado");
    const comunicadoImagenInput = document.getElementById("comunicadoImagen");
    const comunicadoPreview = document.getElementById("comunicadoPreview");
    const tablaComunicadosBody = document.getElementById(
        "tabla-comunicados-body"
    );
    const placeholderImage = "Iconos/placeholder-image.png";

    // --- Variables para Importar Archivos ---
    const fileUploadInput = document.getElementById("file-upload");
    const fileNameDisplay = document.getElementById("file-name");
    const importForm = document.getElementById("form-importar-lecturas");
    const processButton = document.getElementById("btn-procesar-archivo");
    const errorMessageDiv = document.getElementById("file-error-message");

    const pagosFileUploadInput = document.getElementById("pagos-file-upload");
    const pagosFileNameDisplay = document.getElementById("pagos-file-name");
    const importPagosForm = document.getElementById("form-importar-pagos");
    const processPagosButton = document.getElementById("btn-procesar-pagos");
    const errorPagosMessageDiv = document.getElementById(
        "pagos-file-error-message"
    );
    const btnVolverPagos = document.getElementById("btn-volver-import-pagos");

    const cargosFileUploadInput = document.getElementById("cargos-file-upload");
    const cargosFileNameDisplay = document.getElementById("cargos-file-name");
    const importCargosForm = document.getElementById("form-importar-cargos");
    const processCargosButton = document.getElementById("btn-procesar-cargos");
    const errorCargosMessageDiv = document.getElementById(
        "cargos-file-error-message"
    );
    const btnVolverCargos = document.getElementById("btn-volver-import-cargos");

    // --- Variables para Modal de Lectura y Cambio de Medidor ---
    const modalLectura = document.getElementById("modalAgregarLectura");
    const formAgregarLectura = document.getElementById("form-agregar-lectura");
    const vistaRegistrarLecturas = document.getElementById(
        "vista-registrar-lecturas"
    );
    const modalLecturaTitulo = document.getElementById("modalLecturaTitulo");
    const inputLecturaAnterior = document.getElementById("lectura-anterior");
    const inputLecturaActual = document.getElementById("lectura-actual");
    const inputFechaLectura = document.getElementById("fecha-lectura");
    const inputConsumoCalculado = document.getElementById("consumo-calculado");
    const inputIdMedidor = document.getElementById("lectura-id-medidor");
    const lecturaWarning = document.getElementById("lectura-warning");

    const modalCambiarMedidor = document.getElementById("modalCambiarMedidor");
    const formCambiarMedidor = document.getElementById("form-cambiar-medidor");

    // --- INICIO: Variables para Modal de Edición de Lectura ---
    const modalEditarLectura = document.getElementById("modalEditarLectura");
    const formEditarLectura = document.getElementById("form-editar-lectura");
    const tablaLecturas = document.querySelector("#vista-lecturas .unified-table tbody");
    const inputEditLecturaActual = document.getElementById("edit-lectura-actual");
    const inputEditLecturaAnterior = document.getElementById("edit-lectura-anterior");
    const editLecturaWarning = document.getElementById("edit-lectura-warning");
    const inputEditConsumo = document.getElementById("edit-consumo-calculado");
    // --- FIN: Variables para Modal de Edición de Lectura ---
    
    // =============================================
    // === LÓGICA DE NAVEGACIÓN PRINCIPAL (MENÚ)
    // =============================================

    // --- Lógica para el Menú de Hamburguesa ---
    if (menuHamburguesa && contenedorMenu) {
        menuHamburguesa.addEventListener("click", () => {
            contenedorMenu.classList.toggle("menu-visible");
            const isExpanded =
                contenedorMenu.classList.contains("menu-visible");
            menuHamburguesa.setAttribute("aria-expanded", isExpanded);
        });
    }

    // --- Funciones de Navegación ---
    const cerrarMenuMovil = () => {
        if (
            contenedorMenu &&
            contenedorMenu.classList.contains("menu-visible")
        ) {
            contenedorMenu.classList.remove("menu-visible");
            menuHamburguesa.setAttribute("aria-expanded", "false");
        }
    };

    function mostrarVista(idVistaAMostrar) {
        todasLasVistas.forEach((vista) => {
            vista.style.display = "none";
        });
        if (idVistaAMostrar) {
            const vistaActiva = document.getElementById(idVistaAMostrar);
            if (vistaActiva) {
                vistaActiva.style.display = "block";
            } else {
                console.error(
                    `Error: No se encontró el elemento con ID: ${idVistaAMostrar}`
                );
            }
        }
    }

    function clearAllMenuStates() {
        allEncabezadoNav.forEach((header) => {
            header.classList.remove("activo");
            if (header.id && header.id.startsWith("menu-")) {
                const submenu = document.getElementById(
                    header.id.replace("menu-", "submenu-")
                );
                if (submenu) submenu.classList.remove("visible");
            }
        });

        allElementoNavSubmenu.forEach((subItem) => {
            if (subItem.classList.contains("seleccionado")) {
                const icono = subItem.querySelector(".icono");
                if (icono && icono.dataset.srcOriginal) {
                    icono.src = icono.dataset.srcOriginal;
                    delete icono.dataset.srcOriginal;
                }
            }
            subItem.classList.remove("seleccionado");
        });
        elementoSeleccionadoGlobal = null;
    }

    // --- Event Listeners para la Navegación ---
    allEncabezadoNav.forEach((header) => {
        header.addEventListener("click", function () {
            const isCurrentlyActive = this.classList.contains("activo");
            const esMenuInicio = this.id === "menu-inicio";
            const esMenuComunicaciones = this.id === "menu-comunicaciones";
            const submenuId = this.id;
            const submenu =
                submenuId &&
                !esMenuInicio &&
                document.getElementById(submenuId.replace("menu-", "submenu-"));

            if (!esMenuInicio || !isCurrentlyActive) {
                todasLasVistas.forEach(
                    (vista) => (vista.style.display = "none")
                );
            }

            clearAllMenuStates();

            if (esMenuInicio) {
                this.classList.add("activo");
                mostrarVista("contenido-inicio");
                cerrarMenuMovil();
            } else if (esMenuComunicaciones) {
                this.classList.add("activo");
                mostrarVista("vista-comunicaciones");
                cerrarMenuMovil();
            } else if (submenu) {
                if (!isCurrentlyActive) {
                    this.classList.add("activo");
                    submenu.classList.add("visible");
                }
            } else {
                this.classList.add("activo");
            }
        });
    });

    allElementoNavSubmenu.forEach((subItem) => {
        subItem.addEventListener("click", function (e) {
            e.stopPropagation();

            const parentEncabezado =
                this.closest(".seccion-nav").querySelector(".encabezado-nav");
            todasLasVistas.forEach((vista) => (vista.style.display = "none"));
            clearAllMenuStates();

            if (parentEncabezado) {
                parentEncabezado.classList.add("activo");
                if (
                    parentEncabezado.id &&
                    parentEncabezado.id.startsWith("menu-")
                ) {
                    const parentSubmenu = document.getElementById(
                        parentEncabezado.id.replace("menu-", "submenu-")
                    );
                    if (parentSubmenu) parentSubmenu.classList.add("visible");
                }
            }

            this.classList.add("seleccionado");
            elementoSeleccionadoGlobal = this;

            const iconoActual = this.querySelector(".icono");
            if (iconoActual) {
                const currentSrc = iconoActual.src;
                if (!iconoActual.dataset.srcOriginal) {
                    iconoActual.dataset.srcOriginal = currentSrc;
                }
                const parts = currentSrc.split("/");
                const fileNameWithExt = parts.pop();
                const pathPrefix =
                    parts.join("/") + (parts.length > 0 ? "/" : "");
                const dotIndex = fileNameWithExt.lastIndexOf(".");
                let baseName =
                    dotIndex !== -1
                        ? fileNameWithExt.substring(0, dotIndex)
                        : fileNameWithExt;
                let fileExtension =
                    dotIndex !== -1 ? fileNameWithExt.substring(dotIndex) : "";

                if (!baseName.endsWith("-azul")) {
                    const targetBlueSrc = `${pathPrefix}${baseName}-azul${fileExtension}`;
                    iconoActual.src = targetBlueSrc;
                }
            }

            const textoSeleccionado =
                this.querySelector("span").textContent.trim();

            // --- Enrutador de Vistas ---
            if (textoSeleccionado === "Registrar Pago / Nota")
                mostrarVista("vista-registrar-pago-nota");
            else if (textoSeleccionado === "Pagos") mostrarVista("vista-pagos");
            else if (textoSeleccionado === "Notas Crédito / Débito")
                mostrarVista("vista-notas-credito-debito");
            else if (textoSeleccionado === "Generar Comprobante de pago")
                mostrarVista("vista-solicitar-comprobante");
            else if (textoSeleccionado === "Lista de Suscriptores") {
                mostrarVista("vista-lista-suscriptores");
                cargarSuscriptores();
            } else if (textoSeleccionado === "Estado de Cartera")
                mostrarVista("vista-estado-cartera");
            else if (textoSeleccionado === "Pendientes")
                mostrarVista("vista-facturas-pendientes");
            else if (textoSeleccionado === "Pagadas")
                mostrarVista("vista-facturas-pagadas");
            else if (textoSeleccionado === "Todas")
                mostrarVista("vista-facturas-todas");
            else if (textoSeleccionado === "PQR") mostrarVista("vista-pqr");
            else if (textoSeleccionado === "Editar información de contacto")
                mostrarVista("vista-editar-contacto");
            else if (textoSeleccionado === "Cambiar contraseña")
                mostrarVista("vista-cambiar-contrasena");
            else if (textoSeleccionado === "Crear otros conceptos")
                mostrarVista("vista-crear-otros-conceptos");
            else if (textoSeleccionado === "Facturas")
                mostrarVista("vista-facturas");
            else if (textoSeleccionado.includes("Generación de paquetes"))
                mostrarVista("vista-generacion-paquetes");
            else if (textoSeleccionado === "Otros Conceptos")
                mostrarVista("vista-otros-conceptos");
            else if (textoSeleccionado === "Registrar Lecturas") {
                mostrarVista("vista-registrar-lecturas");
                cargarSuscriptoresParaLectura();
            } else if (textoSeleccionado === "Lecturas") {
                mostrarVista("vista-lecturas");
                cargarLecturas(); // <<-- NUEVA LLAMADA
            } else if (textoSeleccionado === "Crear acuerdo de pago")
                mostrarVista("vista-crear-acuerdo-pago");
            else if (textoSeleccionado === "Créditos")
                mostrarVista("vista-creditos");
            else if (textoSeleccionado === "Reporte de pagos")
                mostrarVista("vista-reporte-pagos");
            else if (textoSeleccionado === "Reporte general de facturación")
                mostrarVista("vista-reporte-general-facturacion");
            else if (textoSeleccionado === "Importar lecturas")
                mostrarVista("vista-importar-lecturas");
            else if (textoSeleccionado === "Importar pagos")
                mostrarVista("vista-importar-pagos");
            else if (textoSeleccionado === "Importar Otros Cargos")
                mostrarVista("vista-importar-otros-cargos");
            else if (textoSeleccionado === "Crear Suscriptor") {
                mostrarVista("vista-crear-suscriptor");

                const estadoInicialClienteSelect = document.getElementById(
                    "estadoInicialCliente"
                );
                const seccionDatosMedidor = document.getElementById(
                    "seccionDatosMedidor"
                );
                const camposMedidor =
                    seccionDatosMedidor.querySelectorAll("input, select");

                const toggleCamposMedidor = () => {
                    const isDisabled =
                        estadoInicialClienteSelect.value !== "Activo";
                    camposMedidor.forEach((campo) => {
                        campo.disabled = isDisabled;
                        if (isDisabled) campo.removeAttribute("required");
                        else campo.setAttribute("required", "true");
                    });
                    seccionDatosMedidor.style.display = isDisabled
                        ? "none"
                        : "block";
                };

                estadoInicialClienteSelect.addEventListener(
                    "change",
                    toggleCamposMedidor
                );
                toggleCamposMedidor();

                const formCrearSuscriptor = document.getElementById(
                    "form-crear-suscriptor"
                );
                formCrearSuscriptor.addEventListener("submit", function (e) {
                    e.preventDefault();
                    alert(
                        "Formulario de creación de suscriptor enviado (simulación)."
                    );
                    formCrearSuscriptor.reset();
                    toggleCamposMedidor();
                });
            }

            cerrarMenuMovil();
        });
    });

    // --- Carga Inicial ---
    const menuInicio = document.getElementById("menu-inicio");
    if (menuInicio) {
        if (window.innerWidth > 992) {
            menuInicio.click();
        } else {
            mostrarVista("contenido-inicio");
        }
    } else {
        todasLasVistas.forEach((vista) => (vista.style.display = "none"));
        console.error("El elemento 'menu-inicio' no fue encontrado.");
    }

    // =============================================
    // === LÓGICA DE MODALES
    // =============================================

    // --- Lógica General para Cerrar Modales ---
    const cerrarTodosLosModales = () => {
        todosLosModales.forEach((modal) => modal.classList.remove("show"));
    };

    todosLosBotonesCerrar.forEach((boton) => {
        boton.addEventListener("click", cerrarTodosLosModales);
    });

    window.addEventListener("click", (e) => {
        todosLosModales.forEach((modal) => {
            if (e.target === modal) cerrarTodosLosModales();
        });
    });

    // --- Lógica para Modal de Agregar Nota ---
    const abrirModalNota = (e) => {
        e.preventDefault();
        const fila = e.target.closest("tr");
        const nuid = fila.querySelector('[data-title="NUID"]').textContent;
        const nombre = fila.querySelector(
            '[data-title="SUSCRIPTOR"]'
        ).textContent;
        const saldoTexto = fila.querySelector(
            '[data-title="SALDO NO FINANCIADO"]'
        ).textContent;

        saldoNumericoActual =
            parseFloat(
                saldoTexto.replace(/[^0-9,-]+/g, "").replace(",", ".")
            ) || 0;

        modalNuidNota.textContent = nuid;
        modalNombreNota.textContent = nombre;
        modalSaldoNota.textContent = saldoTexto;
        nuevoSaldoInput.value = saldoTexto;

        modalNota.classList.add("show");
    };

    const cerrarModalNota = () => {
        modalNota.classList.remove("show");
        modalFormNota.reset();
    };

    botonesAgregarNota.forEach((boton) => {
        boton.addEventListener("click", abrirModalNota);
    });

    if (modalFormNota) {
        modalFormNota.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Nota agregada (simulación).");
            cerrarModalNota();
        });
    }

    const calcularNuevoSaldo = () => {
        const valorNota = parseFloat(valorInputNota.value) || 0;
        const tipoNota = document.querySelector(
            'input[name="tipoNota"]:checked'
        ).value;
        let nuevoSaldo =
            tipoNota === "debito"
                ? saldoNumericoActual + valorNota
                : saldoNumericoActual - valorNota;
        nuevoSaldoInput.value = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(nuevoSaldo);
    };

    valorInputNota.addEventListener("input", calcularNuevoSaldo);
    document.querySelectorAll('input[name="tipoNota"]').forEach((radio) => {
        radio.addEventListener("change", calcularNuevoSaldo);
    });

    // --- Lógica para Modal de Pagar ---
    const abrirModalPago = (e) => {
        e.preventDefault();
        const fila = e.target.closest("tr");
        const nombre = fila.querySelector(
            '[data-title="SUSCRIPTOR"]'
        ).textContent;
        const saldoTexto = fila.querySelector(
            '[data-title="SALDO NO FINANCIADO"]'
        ).textContent;
        const saldoNumerico =
            parseFloat(
                saldoTexto.replace(/[^0-9,-]+/g, "").replace(",", ".")
            ) || 0;

        modalNombrePagoHeader.textContent = nombre;
        modalSaldoPago.textContent = saldoTexto;
        pagoValorInput.value = saldoNumerico;
        modalPago.classList.add("show");
    };

    const cerrarModalPago = () => {
        modalPago.classList.remove("show");
        if (modalFormPago) modalFormPago.reset();
    };

    botonesPagar.forEach((boton) => {
        boton.addEventListener("click", abrirModalPago);
    });

    if (modalFormPago) {
        modalFormPago.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Pago procesado (simulación).");
            cerrarModalPago();
        });
    }

    // --- Lógica para Modal Editar Suscriptor ---
    if (tablaSuscriptoresBody) {
        tablaSuscriptoresBody.addEventListener("click", function (e) {
            const editButton = e.target.closest('a[href="#"]');
            if (
                editButton &&
                editButton.textContent.includes("Editar suscriptor")
            ) {
                e.preventDefault();
                const nuid = editButton
                    .closest("tr")
                    .querySelector('[data-title="NUID"]').textContent;
                abrirModalEditar(nuid);
            }
        });
    }

    async function abrirModalEditar(nuid) {
        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/suscriptor/${nuid}`
            );
            if (!respuesta.ok)
                throw new Error(
                    "No se pudieron cargar los datos del suscriptor."
                );
            const data = await respuesta.json();

            document.getElementById("edit-nuid").value = data.nuid;
            document.getElementById("edit-numeroDocumento").value =
                data.szNumeroDocumento;
            if (data.dtFechaExpedicion) {
                document.getElementById("edit-fechaExpedicion").value =
                    new Date(data.dtFechaExpedicion)
                        .toISOString()
                        .split("T")[0];
            }
            document.getElementById("edit-primerNombre").value =
                data.szPrimerNombre;
            document.getElementById("edit-segundoNombre").value =
                data.szSegundoNombre || "";
            document.getElementById("edit-primerApellido").value =
                data.szPrimerApellido;
            document.getElementById("edit-segundoApellido").value =
                data.szSegundoApellido || "";
            document.getElementById("edit-email").value = data.szEmail;
            document.getElementById("edit-telefonoPrincipal").value =
                data.szTelefonoPrincipal;
            document.getElementById("edit-apellidoCasada").value =
                data.szApellidoCasada || "";
            document.getElementById("edit-telefonoSecundario").value =
                data.szTelefonoSecundario || "";
            document.getElementById("edit-numeroContrato").value =
                data.szNumeroContrato;
            document.getElementById("edit-direccionServicio").value =
                data.szDireccionServicio;
            document.getElementById("edit-nombrePredio").value =
                data.szNombrePredio || "";
            document.getElementById("edit-estratoSocioeconomico").value =
                data.nEstratoSocioeconomico;
            document.getElementById("edit-claseUsoInmueble").value =
                data.szClaseUso;

            populateSelect(
                "edit-tipoDocumento",
                data.tipos_documento,
                data.fkIdTipoDocumento
            );
            populateSelect(
                "edit-estadoCliente",
                data.estados_cliente,
                data.fkIdEstadoCliente
            );

            modalEditar.classList.add("show");
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    }

    function populateSelect(selectId, optionsString, selectedValue) {
        const select = document.getElementById(selectId);
        select.innerHTML = "";
        const options = optionsString.split(";");
        options.forEach((opt) => {
            const [value, text] = opt.split(":");
            const optionEl = document.createElement("option");
            optionEl.value = value;
            optionEl.textContent = text;
            if (value == selectedValue) optionEl.selected = true;
            select.appendChild(optionEl);
        });
    }

    if (formEditarSuscriptor) {
        formEditarSuscriptor.addEventListener("submit", async function (e) {
            e.preventDefault();
            const nuid = document.getElementById("edit-nuid").value;
            const formData = {
                tipoDocumento:
                    document.getElementById("edit-tipoDocumento").value,
                numeroDocumento: document.getElementById("edit-numeroDocumento")
                    .value,
                fechaExpedicion: document.getElementById("edit-fechaExpedicion")
                    .value,
                primerNombre:
                    document.getElementById("edit-primerNombre").value,
                segundoNombre:
                    document.getElementById("edit-segundoNombre").value,
                primerApellido: document.getElementById("edit-primerApellido")
                    .value,
                segundoApellido: document.getElementById("edit-segundoApellido")
                    .value,
                email: document.getElementById("edit-email").value,
                telefonoPrincipal: document.getElementById(
                    "edit-telefonoPrincipal"
                ).value,
                apellidoCasada: document.getElementById("edit-apellidoCasada")
                    .value,
                telefonoSecundario: document.getElementById(
                    "edit-telefonoSecundario"
                ).value,
                numeroContrato: document.getElementById("edit-numeroContrato")
                    .value,
                direccionServicio: document.getElementById(
                    "edit-direccionServicio"
                ).value,
                nombrePredio:
                    document.getElementById("edit-nombrePredio").value,
                estrato: document.getElementById("edit-estratoSocioeconomico")
                    .value,
                claseUso: document.getElementById("edit-claseUsoInmueble")
                    .value,
                estadoCliente:
                    document.getElementById("edit-estadoCliente").value,
            };

            try {
                const respuesta = await fetch(
                    `http://localhost:3000/api/suscriptor/${nuid}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formData),
                    }
                );
                const resultado = await respuesta.json();
                if (!respuesta.ok)
                    throw new Error(
                        resultado.message || "Error al guardar los cambios."
                    );
                alert(resultado.message);
                modalEditar.classList.remove("show");
                cargarSuscriptores();
            } catch (error) {
                console.error("Error en el envío:", error);
                alert(error.message);
            }
        });
    }

    // --- Lógica Modal Agregar Lectura ---
    if (vistaRegistrarLecturas) {
        vistaRegistrarLecturas.addEventListener("click", function (e) {
            if (e.target.classList.contains("btn-agregar-lectura")) {
                const fila = e.target.closest("tr");
                const nuid = fila
                    .querySelector('[data-title="NUID"]')
                    .textContent.trim();
                abrirModalLectura(nuid);
            }
        });
    }

    async function abrirModalLectura(nuid) {
        if (formAgregarLectura) formAgregarLectura.reset();
        lecturaWarning.style.display = "none";
        inputLecturaActual.style.borderColor = "";

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/medidor/${nuid}/ultima-lectura`
            );
            const data = await respuesta.json();
            if (!respuesta.ok)
                throw new Error(data.message || "Error al obtener datos.");

            modalLecturaTitulo.textContent = `Agregar lectura a: ${nuid} ${data.nombreSuscriptor}`;
            inputLecturaAnterior.value = data.lecturaAnterior;
            inputIdMedidor.value = data.idMedidor;
            modalLectura.classList.add("show");
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    }

    if (inputLecturaActual) {
        inputLecturaActual.addEventListener("input", function () {
            const anterior = parseFloat(inputLecturaAnterior.value) || 0;
            const actual = parseFloat(this.value) || 0;

            if (actual < anterior) {
                lecturaWarning.style.display = "block";
                inputLecturaActual.style.borderColor = "#dc3545";
                inputConsumoCalculado.value = 0;
            } else {
                lecturaWarning.style.display = "none";
                inputLecturaActual.style.borderColor = "";
                inputConsumoCalculado.value = actual - anterior;
            }
        });
    }

    if (formAgregarLectura) {
        formAgregarLectura.addEventListener("submit", async function (e) {
            e.preventDefault();
            const anterior = parseFloat(inputLecturaAnterior.value);
            const actual = parseFloat(inputLecturaActual.value);

            if (actual < anterior) {
                alert(
                    "Error: La lectura actual no puede ser menor a la anterior."
                );
                return;
            }

            const datosLectura = {
                idMedidor: inputIdMedidor.value,
                lecturaActual: actual,
                fechaLectura: inputFechaLectura.value,
            };

            try {
                const respuesta = await fetch(
                    "http://localhost:3000/api/lecturas",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(datosLectura),
                    }
                );
                const resultado = await respuesta.json();
                if (!respuesta.ok)
                    throw new Error(
                        resultado.message || "Error al guardar la lectura."
                    );
                alert(resultado.message);
                modalLectura.classList.remove("show");
            } catch (error) {
                console.error("Error al enviar:", error);
                alert(error.message);
            }
        });
    }

    // --- Lógica Modal Cambiar Medidor ---
    if (vistaRegistrarLecturas) {
        vistaRegistrarLecturas.addEventListener("click", function (e) {
            const cambiarButton = e.target.closest(".btn-cambiar-medidor");
            if (cambiarButton) {
                const fila = cambiarButton.closest("tr");
                const nuid = fila
                    .querySelector('[data-title="NUID"]')
                    .textContent.trim();
                abrirModalCambiarMedidor(nuid);
            }
        });
    }

    async function abrirModalCambiarMedidor(nuid) {
        if (formCambiarMedidor) formCambiarMedidor.reset();

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/medidor/${nuid}/ultima-lectura`
            );
            const data = await respuesta.json();
            if (!respuesta.ok)
                throw new Error(
                    data.message || "Error al obtener datos del medidor."
                );

            document.getElementById(
                "modalCambiarMedidorTitulo"
            ).textContent = `Agregar nuevo contador a: ${nuid} ${data.nombreSuscriptor}`;
            document.getElementById(
                "modalCambiarMedidorInfo"
            ).textContent = `Medidor actual: ${
                data.numeroMedidorActual || "No encontrado"
            }.`;
            document.getElementById("cambiar-medidor-nuid").value = nuid;
            modalCambiarMedidor.classList.add("show");
        } catch (error) {
            console.error("Error al abrir modal de cambio de medidor:", error);
            alert(error.message);
        }
    }

    if (formCambiarMedidor) {
        formCambiarMedidor.addEventListener("submit", async function (e) {
            e.preventDefault();
            const nuid = document.getElementById("cambiar-medidor-nuid").value;
            const nuevoNumero = document.getElementById(
                "cambiar-numero-medidor"
            ).value;
            const ultimaMedicion = document.getElementById(
                "cambiar-ultima-medicion"
            ).value;
            const fechaInstalacion = document.getElementById(
                "cambiar-fecha-instalacion"
            ).value;

            if (!nuevoNumero || !fechaInstalacion) {
                alert("Por favor, complete todos los campos requeridos.");
                return;
            }

            const datos = {
                nuid,
                nuevoNumeroMedidor: nuevoNumero,
                lecturaInicial: ultimaMedicion,
                fechaInstalacion,
            };

            try {
                const respuesta = await fetch(
                    "http://localhost:3000/api/medidores/cambiar",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(datos),
                    }
                );
                const resultado = await respuesta.json();
                if (!respuesta.ok) throw new Error(resultado.message);
                alert(resultado.message);
                modalCambiarMedidor.classList.remove("show");
                cargarSuscriptoresParaLectura();
            } catch (error) {
                console.error("Error al cambiar medidor:", error);
                alert(error.message);
            }
        });
    }
    
    // =============================================
    // === INICIO: LÓGICA DE EDICIÓN DE LECTURAS
    // =============================================
    
    // --- Event listener para botones de Anular y Editar en la tabla de lecturas ---
    if (tablaLecturas) {
        tablaLecturas.addEventListener("click", async (e) => {
            const botonAnular = e.target.closest(".btn-anular-lectura");
            const botonEditar = e.target.closest(".btn-editar-lectura");

            if (botonAnular) {
                e.preventDefault();
                const idLectura = botonAnular.dataset.id;
                const confirmado = confirm(
                    `¿Está seguro de anular la lectura ID ${idLectura}? Esta acción no se puede deshacer.`
                );

                if (confirmado) {
                    try {
                        const respuesta = await fetch(`http://localhost:3000/api/lecturas/${idLectura}/anular`, { method: "PUT" });
                        const resultado = await respuesta.json();
                        if (!respuesta.ok) throw new Error(resultado.message || "Error en el servidor.");
                        alert(resultado.message);
                        cargarLecturas();
                    } catch (error) {
                        console.error("Error al anular:", error);
                        alert(`No se pudo anular la lectura. ${error.message}`);
                    }
                }
            }

            if (botonEditar) {
                e.preventDefault();
                const idLectura = botonEditar.dataset.id;
                abrirModalEditarLectura(idLectura);
            }
        });
    }

    // --- Función para abrir y poblar el modal de edición de lectura ---
    async function abrirModalEditarLectura(id) {
        formEditarLectura.reset();
        editLecturaWarning.style.display = "none";
        inputEditLecturaActual.style.borderColor = "";

        try {
            const respuesta = await fetch(`http://localhost:3000/api/lecturas/${id}`);
            if (!respuesta.ok) throw new Error("No se pudo cargar la información de la lectura.");
            const data = await respuesta.json();

            document.getElementById("edit-lectura-id").value = data.pkIdLectura;
            document.getElementById("edit-lectura-anterior-valor").value = data.lecturaAnterior;
            inputEditLecturaAnterior.value = data.lecturaAnterior;
            inputEditLecturaActual.value = data.dcValorLectura;
            document.getElementById("edit-fecha-lectura").value = new Date(data.dtFechaLectura).toISOString().split("T")[0];
            inputEditConsumo.value = data.dcValorLectura - data.lecturaAnterior;

            modalEditarLectura.classList.add("show");
        } catch (error) {
            console.error("Error al abrir modal de edición:", error);
            alert(error.message);
        }
    }
    
    // --- Lógica de cálculo en vivo para el modal de edición ---
    if (inputEditLecturaActual) {
        inputEditLecturaActual.addEventListener("input", () => {
            const anterior = parseFloat(document.getElementById("edit-lectura-anterior-valor").value) || 0;
            const actual = parseFloat(inputEditLecturaActual.value) || 0;

            if (actual < anterior) {
                editLecturaWarning.style.display = 'block';
                inputEditLecturaActual.style.borderColor = '#dc3545';
                inputEditConsumo.value = 0;
            } else {
                editLecturaWarning.style.display = 'none';
                inputEditLecturaActual.style.borderColor = '';
                inputEditConsumo.value = actual - anterior;
            }
        });
    }

    // --- Event listener para el envío del formulario de edición de lectura ---
    if (formEditarLectura) {
        formEditarLectura.addEventListener("submit", async (e) => {
            e.preventDefault();
            const idLectura = document.getElementById("edit-lectura-id").value;
            const anterior = parseFloat(document.getElementById("edit-lectura-anterior-valor").value);
            const actual = parseFloat(document.getElementById("edit-lectura-actual").value);
            
            if (actual < anterior) {
                alert("La lectura actual no puede ser menor que la anterior.");
                return;
            }

            const datosParaActualizar = {
                dcValorLectura: actual,
                dtFechaLectura: document.getElementById("edit-fecha-lectura").value,
            };

            try {
                const respuesta = await fetch(`http://localhost:3000/api/lecturas/${idLectura}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosParaActualizar)
                });

                const resultado = await respuesta.json();
                if (!respuesta.ok) throw new Error(resultado.message);

                alert(resultado.message);
                modalEditarLectura.classList.remove("show");
                cargarLecturas(); // Recargar la tabla para mostrar los cambios
            } catch (error) {
                console.error("Error al actualizar la lectura:", error);
                alert(`Error: ${error.message}`);
            }
        });
    }
    // =============================================
    // === FIN: LÓGICA DE EDICIÓN DE LECTURAS
    // =============================================


    // =============================================
    // === LÓGICA DE VISTAS ESPECÍFICAS
    // =============================================

    // --- Lógica para "Solicitar Comprobante de Pago" (Month Picker) ---
    function updateYearDisplay() {
        if (yearDisplay) yearDisplay.textContent = currentYear;
    }

    function updateInput() {
        if (inputPeriodo)
            inputPeriodo.value = `${meses[selectedMonth]}${currentYear}`;
        if (monthsGrid) {
            monthsGrid
                .querySelectorAll(".month")
                .forEach((m) => m.classList.remove("selected"));
            const selectedMonthDiv = monthsGrid.querySelector(
                `.month[data-month="${selectedMonth}"]`
            );
            if (selectedMonthDiv) selectedMonthDiv.classList.add("selected");
        }
    }

    if (inputPeriodo && pickerBtn) {
        [inputPeriodo, pickerBtn].forEach((el) => {
            el.addEventListener("click", (e) => {
                e.stopPropagation();
                if (dropdown)
                    dropdown.style.display =
                        dropdown.style.display === "block" ? "none" : "block";
            });
        });
    }

    if (prevYearBtn)
        prevYearBtn.addEventListener("click", () => {
            currentYear--;
            updateYearDisplay();
        });
    if (nextYearBtn)
        nextYearBtn.addEventListener("click", () => {
            currentYear++;
            updateYearDisplay();
        });

    if (monthsGrid) {
        monthsGrid.addEventListener("click", (e) => {
            if (e.target.classList.contains("month")) {
                selectedMonth = parseInt(e.target.dataset.month);
                updateInput();
                if (dropdown) dropdown.style.display = "none";
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (
            dropdown &&
            !dropdown.contains(e.target) &&
            e.target !== inputPeriodo &&
            e.target !== pickerBtn
        ) {
            dropdown.style.display = "none";
        }
    });

    updateYearDisplay();
    updateInput();

    // --- Lógica para Panel de Comunicaciones ---
    if (comunicadoImagenInput && comunicadoPreview) {
        comunicadoImagenInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    comunicadoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                comunicadoPreview.src = placeholderImage;
            }
        });
    }

    if (formComunicado) {
        formComunicado.addEventListener("submit", function (e) {
            e.preventDefault();
            const titulo = document.getElementById("comunicadoTitulo").value;
            const imagenSrc = comunicadoPreview.src;
            const fechaInicioValue =
                document.getElementById("comunicadoInicio").value;
            const fechaFinValue =
                document.getElementById("comunicadoFin").value;

            if (!fechaInicioValue || !fechaFinValue) {
                alert("Por favor, seleccione las fechas de inicio y fin.");
                return;
            }

            const fechaInicio = new Date(fechaInicioValue + "T00:00:00");
            const fechaFin = new Date(fechaFinValue + "T23:59:59");
            const hoy = new Date();
            let estadoTexto = "",
                estadoClase = "";

            if (hoy < fechaInicio) {
                estadoTexto = "Programado";
                estadoClase = "status-programado";
            } else if (hoy >= fechaInicio && hoy <= fechaFin) {
                estadoTexto = "Activo";
                estadoClase = "status-activo";
            } else {
                estadoTexto = "Finalizado";
                estadoClase = "status-inactivo";
            }

            const opcionesFecha = {
                day: "2-digit",
                month: "short",
                year: "numeric",
            };
            const periodo = `${fechaInicio.toLocaleDateString(
                "es-ES",
                opcionesFecha
            )} - ${fechaFin.toLocaleDateString("es-ES", opcionesFecha)}`;
            const nuevaFila = document.createElement("tr");
            nuevaFila.innerHTML = `
                <td data-title="IMAGEN"><img src="${imagenSrc}" alt="${titulo}" class="comunicado-thumbnail"/></td>
                <td data-title="TÍTULO">${titulo}</td>
                <td data-title="PERIODO">${periodo}</td>
                <td data-title="ESTADO"><span class="${estadoClase}">${estadoTexto}</span></td>
                <td data-title="ACCIONES"><a href="#" class="action-delete" onclick="eliminarFila(this)"><i class="fa fa-trash-o"></i> Eliminar</a></td>
            `;
            if (tablaComunicadosBody) tablaComunicadosBody.prepend(nuevaFila);

            formComunicado.reset();
            comunicadoPreview.src = placeholderImage;
            alert("Campaña guardada y programada con éxito.");
        });
    }

    // --- Lógica para Formularios de Importación ---
    function setupImportForm(
        fileInput,
        nameDisplay,
        form,
        processBtn,
        errorDiv,
        allowedExt,
        volverBtn,
        vistaAnterior
    ) {
        if (fileInput && nameDisplay && processBtn && errorDiv) {
            fileInput.addEventListener("change", () => {
                errorDiv.textContent = "";
                processBtn.disabled = true;
                if (fileInput.files.length > 0) {
                    const fileName = fileInput.files[0].name;
                    const fileExtension = fileName
                        .split(".")
                        .pop()
                        .toLowerCase();
                    if (allowedExt.includes(fileExtension)) {
                        nameDisplay.textContent = fileName;
                        nameDisplay.style.fontStyle = "normal";
                        processBtn.disabled = false;
                    } else {
                        errorDiv.textContent = `Extensión "${fileExtension}" no permitida. Solo se aceptan: ${allowedExt.join(
                            ", "
                        )}.`;
                        nameDisplay.textContent = "Ningún archivo seleccionado";
                        nameDisplay.style.fontStyle = "italic";
                        fileInput.value = "";
                    }
                } else {
                    nameDisplay.textContent = "Ningún archivo seleccionado";
                    nameDisplay.style.fontStyle = "italic";
                }
            });
        }
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                alert(
                    `Archivo "${nameDisplay.textContent}" enviado para procesamiento.`
                );
                form.reset();
                nameDisplay.textContent = "Ningún archivo seleccionado";
                nameDisplay.style.fontStyle = "italic";
                if (processBtn) processBtn.disabled = true;
            });
        }
        if (volverBtn) {
            volverBtn.addEventListener("click", () =>
                mostrarVista(vistaAnterior)
            );
        }
    }

    setupImportForm(
        fileUploadInput,
        fileNameDisplay,
        importForm,
        processButton,
        errorMessageDiv,
        ["csv", "xls", "xlsx"]
    );
    setupImportForm(
        pagosFileUploadInput,
        pagosFileNameDisplay,
        importPagosForm,
        processPagosButton,
        errorPagosMessageDiv,
        ["csv", "xls", "xlsx"],
        btnVolverPagos,
        "vista-importar-lecturas"
    );
    setupImportForm(
        cargosFileUploadInput,
        cargosFileNameDisplay,
        importCargosForm,
        processCargosButton,
        errorCargosMessageDiv,
        ["csv"],
        btnVolverCargos,
        "vista-importar-pagos"
    );
});

// =============================================
// === FUNCIONES GLOBALES
// =============================================

// Función global para eliminar una fila de la tabla de comunicaciones
function eliminarFila(boton) {
    if (confirm("¿Estás seguro de que quieres eliminar esta campaña?")) {
        const filaAEliminar = boton.closest("tr");
        if (filaAEliminar) filaAEliminar.remove();
    }
}

// Función para cargar la lista de todos los suscriptores
async function cargarSuscriptores() {
    const tablaBody = document.querySelector(
        "#vista-lista-suscriptores .unified-table tbody"
    );
    if (!tablaBody) return;
    tablaBody.innerHTML =
        '<tr><td colspan="11" style="text-align:center;">Cargando suscriptores...</td></tr>';
    try {
        const respuesta = await fetch("http://localhost:3000/api/suscriptores");
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        const suscriptores = await respuesta.json();
        tablaBody.innerHTML = "";
        if (suscriptores.length === 0) {
            tablaBody.innerHTML =
                '<tr><td colspan="11" style="text-align:center;">No se encontraron suscriptores.</td></tr>';
            return;
        }
        suscriptores.forEach((s) => {
            const nombreCompleto = `${s.szPrimerNombre || ""} ${
                s.szSegundoNombre || ""
            } ${s.szPrimerApellido || ""} ${s.szSegundoApellido || ""}`
                .replace(/\s+/g, " ")
                .trim();
            const filaHtml = `
                <tr>
                    <td data-title="ESTADO"><span class="status-activo">${
                        s.estado || "N/A"
                    }</span></td>
                    <th scope="row" data-title="SUSCRIPTOR">${nombreCompleto}<small style="display: block; color: #6c757d; font-weight: normal;">NUID: ${
                s.nuid || "N/A"
            }</small></th>
                    <td data-title="NUID">${s.nuid || "N/A"}</td>
                    <td data-title="IDENTIFICACIÓN"><span class="identificacion-tipo">${
                        s.tipo_documento || ""
                    }</span><span class="identificacion-numero">${
                s.identificacion || "N/A"
            }</span></td>
                    <td data-title="ESTRATO">Estrato ${s.estrato || "N/A"}</td>
                    <td data-title="RUTA">-</td>
                    <td data-title="NOMBRE PREDIO">${
                        s.nombre_predio || "N/A"
                    }</td>
                    <td data-title="TEL/CELULAR">${s.telefono || "N/A"}</td>
                    <td data-title="SALDO NO FINANCIADO" class="text-right">$0</td>
                    <td data-title="NO. DE MEDIDOR">${
                        s.numero_medidor || "N/A"
                    }</td>
                    <td data-title="Acciones">
                        <div class="table-actions-vertical">
                            <a href="#"><i class="fa fa-pencil-square-o"></i> Editar suscriptor</a>
                            <a href="#"><i class="fa fa-user-o"></i> Ver suscriptor</a>
                            <a href="#"><i class="fa fa-file-text-o"></i> Estado de cuenta</a>
                        </div>
                    </td>
                </tr>`;
            tablaBody.innerHTML += filaHtml;
        });
    } catch (error) {
        console.error("Error al cargar los suscriptores:", error);
        tablaBody.innerHTML = `<tr><td colspan="11" style="text-align:center;">Error al conectar con el servidor. ¿Iniciaste el servidor?</td></tr>`;
    }
}

// Función para cargar suscriptores en la vista "Registrar Lecturas"
async function cargarSuscriptoresParaLectura() {
    const tablaBody = document.querySelector(
        "#vista-registrar-lecturas .unified-table tbody"
    );
    if (!tablaBody) return;
    tablaBody.innerHTML = '<tr><td colspan="10">Cargando...</td></tr>';
    try {
        const respuesta = await fetch(
            "http://localhost:3000/api/suscriptores-para-lectura"
        );
        const suscriptores = await respuesta.json();
        tablaBody.innerHTML = "";
        if (suscriptores.length === 0) {
            tablaBody.innerHTML =
                '<tr><td colspan="10">No hay suscriptores activos para registrar lecturas.</td></tr>';
            return;
        }
        suscriptores.forEach((s) => {
            const nombreCompleto = `${s.szPrimerNombre || ""} ${
                s.szSegundoNombre || ""
            } ${s.szPrimerApellido || ""} ${s.szSegundoApellido || ""}`
                .replace(/\s+/g, " ")
                .trim();
            const filaHtml = `
                <tr>
                    <td data-title="SUSCRIPTOR">${nombreCompleto || "N/A"}</td>
                    <td data-title="NUID">${s.nuid || "N/A"}</td>
                    <td data-title="NÚMERO DE DOCUMENTO">${
                        s.szNumeroDocumento || "N/A"
                    }</td>
                    <td data-title="RUTA">${s.ruta || "-"}</td>
                    <td data-title="CICLO">${s.ciclo || "No asignado"}</td>
                    <td data-title="ESTRATO">Estrato ${s.estrato || "N/A"}</td>
                    <td data-title="DIRECCIÓN">${s.direccion || "N/A"}</td>
                    <td data-title="CELULAR">${s.celular || "N/A"}</td>
                    <td data-title="ÚLTIMA MEDICIÓN COBRADA" class="text-right">${
                        s.ultimaMedicion || 0
                    }</td>
                    <td data-title="Acciones">
                        <div class="table-actions-vertical-buttons">
                            <button class="btn btn-primary btn-sm btn-agregar-lectura"><i class="fa fa-plus-circle" aria-hidden="true"></i> Agregar Lectura</button>
                            <button class="btn btn-warning btn-sm btn-cambiar-medidor"><i class="fa fa-refresh" aria-hidden="true"></i> Cambiar medidor</button>
                        </div>
                    </td>
                </tr>`;
            tablaBody.innerHTML += filaHtml;
        });
    } catch (error) {
        console.error("Error al cargar suscriptores para lectura:", error);
        tablaBody.innerHTML =
            '<tr><td colspan="10" style="text-align:center;">Error al conectar con el servidor.</td></tr>';
    }
}

// =============================================
// === INICIO: FUNCIÓN CARGAR LECTURAS (ACTUALIZADA)
// =============================================
async function cargarLecturas() {
    const tablaBody = document.querySelector(
        "#vista-lecturas .unified-table tbody"
    );
    if (!tablaBody) return;

    tablaBody.innerHTML =
        '<tr><td colspan="10" style="text-align:center;">Cargando historial de lecturas...</td></tr>';

    try {
        const respuesta = await fetch("http://localhost:3000/api/lecturas");
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        const lecturas = await respuesta.json();

        tablaBody.innerHTML = "";

        if (lecturas.length === 0) {
            tablaBody.innerHTML =
                '<tr><td colspan="10" style="text-align:center;">No se encontraron lecturas registradas.</td></tr>';
            return;
        }

        const opcionesFecha = {
            day: "2-digit",
            month: "short",
            year: "numeric",
        };

        lecturas.forEach((l) => {
            const nombreCompleto = `${l.szPrimerNombre || ""} ${
                l.szSegundoNombre || ""
            } ${l.szPrimerApellido || ""} ${l.szSegundoApellido || ""}`
                .replace(/\s+/g, " ")
                .trim();

            const fechaLecturaFormateada = new Date(
                l.fechaLectura
            ).toLocaleDateString("es-ES", opcionesFecha);

            const filaHtml = `
                <tr>
                    <td data-title="SUSCRIPTOR">${nombreCompleto}</td>
                    <td data-title="NUID">${l.nuid || "N/A"}</td>
                    <td data-title="NÚMERO DE DOCUMENTO">${
                        l.szNumeroDocumento || "N/A"
                    }</td>
                    <td data-title="CICLO">${l.ciclo || "No asignado"}</td>
                    <td data-title="N° CONTADOR">${
                        l.numeroContador || "N/A"
                    }</td>
                    <td data-title="LECTURA">${l.lectura}m<sup>3</sup></td>
                    <td data-title="CONSUMO">${l.consumo}m<sup>3</sup></td>
                    <td data-title="FECHA DE LECTURA">${fechaLecturaFormateada}</td>
                    <td data-title="FECHA DE REGISTRO">${fechaLecturaFormateada}</td>
                    <td data-title="ACCIONES">
                        <div style="display: flex; gap: 5px; justify-content: center;">
                            <button class="btn btn-warning btn-sm btn-editar-lectura" data-id="${l.pkIdLectura}">
                                <i class="fa fa-pencil" aria-hidden="true"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-anular-lectura" data-id="${l.pkIdLectura}" style="background-color: #dc3545; color: white; border-color: #dc3545;">
                                <i class="fa fa-ban" aria-hidden="true"></i> Anular
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += filaHtml;
        });
    } catch (error) {
        console.error("Error al cargar las lecturas:", error);
        tablaBody.innerHTML = `<tr><td colspan="10" style="text-align:center;">Error al conectar con el servidor.</td></tr>`;
    }
}
// =============================================
// === FIN: FUNCIÓN CARGAR LECTURAS
// =============================================