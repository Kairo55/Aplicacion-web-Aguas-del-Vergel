document.addEventListener("DOMContentLoaded", function () {
    // Inicializa Flatpickr en el campo de fecha de pago
    flatpickr("#pagoFecha", {
        locale: "es", // Usa la localización en español
        dateFormat: "d-F-Y", // Formato: 16-junio-2025
        defaultDate: "today",
    });

    // --- INICIO: Inicializa Flatpickr para los filtros de reporte ---
    flatpickr("#reporteDesde", {
        locale: "es",
        dateFormat: "d-F-Y",
    });
    flatpickr("#reporteHasta", {
        locale: "es",
        dateFormat: "d-F-Y",
    });
    // --- FIN: Inicializa Flatpickr para los filtros de reporte ---

    // --- INICIO: Inicializa Flatpickr para reporte general de facturación ---
    flatpickr("#reporteGenDesde", {
        locale: "es",
        dateFormat: "d-F-Y",
    });
    flatpickr("#reporteGenHasta", {
        locale: "es",
        dateFormat: "d-F-Y",
    });
    // --- FIN: Inicializa Flatpickr para reporte general de facturación ---

    // --- Lógica para el Menú de Hamburguesa ---
    const menuHamburguesa = document.querySelector(".menu-hamburguesa");
    const contenedorMenu = document.querySelector(".contenedor-menu");

    if (menuHamburguesa && contenedorMenu) {
        menuHamburguesa.addEventListener("click", () => {
            contenedorMenu.classList.toggle("menu-visible");
            const isExpanded =
                contenedorMenu.classList.contains("menu-visible");
            menuHamburguesa.setAttribute("aria-expanded", isExpanded);
        });
    }

    // --- Lógica de Navegación del Panel (existente y mejorada) ---
    const allEncabezadoNav = document.querySelectorAll(".encabezado-nav");
    const allElementoNavSubmenu = document.querySelectorAll(
        ".submenu .elemento-nav"
    );
    let elementoSeleccionadoGlobal = null;

    const todasLasVistas = document.querySelectorAll(".vista-contenido");

    // Función para cerrar el menú móvil si está abierto
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
                if (submenu) {
                    submenu.classList.remove("visible");
                }
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
                //inicio modificacion
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
                    if (parentSubmenu) {
                        parentSubmenu.classList.add("visible");
                    }
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
                    // Se asume que el icono azul existe, si no, se debe gestionar el error
                    iconoActual.src = targetBlueSrc;
                }
            }

            const textoSeleccionado =
                this.querySelector("span").textContent.trim();

            if (textoSeleccionado === "Registrar Pago / Nota") {
                mostrarVista("vista-registrar-pago-nota");
                console.log("Cargando vista: Registrar Pago / Nota...");
            } else if (textoSeleccionado === "Pagos") {
                mostrarVista("vista-pagos");
                console.log("Cargando vista: Pagos...");
            } else if (textoSeleccionado === "Notas Crédito / Débito") {
                mostrarVista("vista-notas-credito-debito");
                console.log("Cargando vista: Notas Crédito / Débito...");
            } else if (textoSeleccionado === "Generar Comprobante de pago") {
                mostrarVista("vista-solicitar-comprobante");
                console.log("Cargando vista: Generar Comprobante de pago...");
            } else if (textoSeleccionado === "Lista de Suscriptores") {
                mostrarVista("vista-lista-suscriptores");
                cargarSuscriptores(); // Asumiendo que esta función está definida para cargar los suscriptores
                console.log("Cargando vista: Lista de Suscriptores...");
            } else if (textoSeleccionado === "Estado de Cartera") {
                mostrarVista("vista-estado-cartera");
                console.log("Cargando vista: Estado de Cartera...");
            } else if (textoSeleccionado === "Pendientes") {
                mostrarVista("vista-facturas-pendientes");
                console.log("Cargando vista: Facturas Pendientes...");
            } else if (textoSeleccionado === "Pagadas") {
                mostrarVista("vista-facturas-pagadas");
                console.log("Cargando vista: Facturas Pagadas...");
            } else if (textoSeleccionado === "Todas") {
                mostrarVista("vista-facturas-todas");
                console.log("Cargando vista: Todas las Facturas...");
            } else if (textoSeleccionado === "PQR") {
                mostrarVista("vista-pqr");
                console.log("Cargando vista: PQR...");
            } else if (textoSeleccionado === "Editar información de contacto") {
                mostrarVista("vista-editar-contacto");
                console.log(
                    "Cargando vista: Editar información de contacto..."
                );
            } else if (textoSeleccionado === "Cambiar contraseña") {
                mostrarVista("vista-cambiar-contrasena");
                console.log("Cargando vista: Cambiar contraseña...");
            } else if (textoSeleccionado === "Crear Suscriptor") {
                mostrarVista("vista-crear-suscriptor");
                console.log("Cargando vista: Crear Suscriptor...");

                // Lógica para habilitar/deshabilitar la sección de Datos del Medidor
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
                        // Si está deshabilitado, eliminamos el atributo 'required'
                        // Si está habilitado, lo volvemos a poner
                        if (isDisabled) {
                            campo.removeAttribute("required");
                        } else {
                            campo.setAttribute("required", "true");
                        }
                    });
                    seccionDatosMedidor.style.display = isDisabled
                        ? "none"
                        : "block";
                };

                // Asignar el evento 'change' y ejecutarlo una vez para el estado inicial
                estadoInicialClienteSelect.addEventListener(
                    "change",
                    toggleCamposMedidor
                );
                toggleCamposMedidor(); // Esto asegura que la sección se oculte/muestre correctamente al cargar la vista

                // Manejar el envío del formulario
                const formCrearSuscriptor = document.getElementById(
                    "form-crear-suscriptor"
                );
                formCrearSuscriptor.addEventListener("submit", function (e) {
                    e.preventDefault(); // Evita el envío tradicional del formulario
                    alert(
                        "Formulario de creación de suscriptor enviado (simulación)."
                    );
                    // Aquí podrías añadir la lógica para enviar los datos a un servidor
                    // fetch('/api/crear-suscriptor', { method: 'POST', body: new FormData(this) })
                    // .then(response => response.json())
                    // .then(data => console.log(data))
                    // .catch(error => console.error('Error:', error));

                    formCrearSuscriptor.reset(); // Resetea todos los campos del formulario
                    toggleCamposMedidor(); // Vuelve a establecer el estado de los campos del medidor después de resetear
                });
            } else if (textoSeleccionado === "Crear otros conceptos") {
                mostrarVista("vista-crear-otros-conceptos");
                console.log("Cargando vista: Crear otros conceptos...");
            } else if (textoSeleccionado === "Facturas") {
                mostrarVista("vista-facturas");
                console.log("Cargando vista: Facturas...");
            } else if (textoSeleccionado.includes("Generación de paquetes")) {
                mostrarVista("vista-generacion-paquetes");
                console.log(
                    "Cargando vista: Generación de paquetes de facturas..."
                );
            } else if (textoSeleccionado === "Otros Conceptos") {
                mostrarVista("vista-otros-conceptos");
                console.log("Cargando vista: Otros Conceptos...");
            } else if (textoSeleccionado === "Registrar Lecturas") {
                mostrarVista("vista-registrar-lecturas");
                cargarSuscriptoresParaLectura();
                console.log("Cargando vista: Registrar Lecturas...");
            } else if (textoSeleccionado === "Lecturas") {
                mostrarVista("vista-lecturas");
                console.log("Cargando vista: Lecturas...");
            } else if (textoSeleccionado === "Crear acuerdo de pago") {
                mostrarVista("vista-crear-acuerdo-pago");
                console.log("Cargando vista: Crear acuerdo de pago...");
            } else if (textoSeleccionado === "Créditos") {
                mostrarVista("vista-creditos");
                console.log("Cargando vista: Créditos...");
            } else if (textoSeleccionado === "Reporte de pagos") {
                mostrarVista("vista-reporte-pagos");
                console.log("Cargando vista: Reporte de pagos...");
            } else if (textoSeleccionado === "Reporte general de facturación") {
                mostrarVista("vista-reporte-general-facturacion");
                console.log(
                    "Cargando vista: Reporte general de facturación..."
                );
            } else if (textoSeleccionado === "Importar lecturas") {
                // <-- AÑADIR ESTE BLOQUE
                mostrarVista("vista-importar-lecturas");
                console.log("Cargando vista: Importar lecturas...");
            } else if (textoSeleccionado === "Importar pagos") {
                // <-- AÑADIR ESTE BLOQUE
                mostrarVista("vista-importar-pagos");
                console.log("Cargando vista: Importar pagos...");
            } else if (textoSeleccionado === "Importar Otros Cargos") {
                // <-- AÑADIR ESTE BLOQUE
                mostrarVista("vista-importar-otros-cargos");
                console.log("Cargando vista: Importar Otros Cargos...");
            } else if (textoSeleccionado === "Pendientes") {
                // (continúa con el resto de los 'else if' si existen)
                // ...
            }

            cerrarMenuMovil(); // Cierra el menú móvil al seleccionar un item
        });
    });

    const menuInicio = document.getElementById("menu-inicio");
    if (menuInicio) {
        // En carga inicial, no hacer clic para no afectar la vista móvil
        if (window.innerWidth > 992) {
            menuInicio.click();
        } else {
            // En móvil, mostrar la vista de inicio sin simular el clic
            mostrarVista("contenido-inicio");
        }
    } else {
        todasLasVistas.forEach((vista) => (vista.style.display = "none"));
        console.error(
            "El elemento 'menu-inicio' no fue encontrado. La vista inicial no se pudo cargar."
        );
    }

    // --- LÓGICA PARA EL MODAL DE AGREGAR NOTA ---
    const modalNota = document.getElementById("modalAgregarNota");
    const botonesAgregarNota = document.querySelectorAll(".btn-agregar-nota");

    // Elementos del modal para poblar con datos
    const modalNuidNota = document.getElementById("modalNuidNota");
    const modalNombreNota = document.getElementById("modalNombreNota");
    const modalSaldoNota = document.getElementById("modalSaldoNota");
    const modalFormNota = document.getElementById("formAgregarNota");
    const valorInputNota = document.getElementById("modalValor");
    const nuevoSaldoInput = document.getElementById("modalNuevoSaldo");
    let saldoNumericoActual = 0;

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

    modalFormNota.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Nota agregada (simulación).");
        cerrarModalNota();
    });

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

    // --- NUEVA LÓGICA PARA EL MODAL DE PAGAR ---
    const modalPago = document.getElementById("modalPagar");
    const botonesPagar = document.querySelectorAll(".btn-pagar");

    const modalNombrePagoHeader = document.getElementById(
        "modalNombrePagoHeader"
    );
    const modalSaldoPago = document.getElementById("modalSaldoPago");
    const modalFormPago = document.getElementById("formPagar");
    const pagoValorInput = document.getElementById("pagoValor");
    const pagoFechaInput = document.getElementById("pagoFecha");

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

        // La lógica para poner la fecha manualmente ha sido eliminada.

        modalPago.classList.add("show");
    };

    const cerrarModalPago = () => {
        modalPago.classList.remove("show");
        modalFormPago.reset();
    };

    botonesPagar.forEach((boton) => {
        boton.addEventListener("click", abrirModalPago);
    });

    modalFormPago.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Pago procesado (simulación).");
        cerrarModalPago();
    });

    // --- LÓGICA GENERAL PARA CERRAR MODALES ---
    const todosLosModales = document.querySelectorAll(".modal");
    const todosLosBotonesCerrar = document.querySelectorAll(
        '[data-dismiss="modal"]'
    );

    const cerrarTodosLosModales = () => {
        todosLosModales.forEach((modal) => modal.classList.remove("show"));
    };

    todosLosBotonesCerrar.forEach((boton) => {
        boton.addEventListener("click", cerrarTodosLosModales);
    });

    window.addEventListener("click", (e) => {
        todosLosModales.forEach((modal) => {
            if (e.target === modal) {
                cerrarTodosLosModales();
            }
        });
    });
});

// --- LÓGICA PARA "SOLICITAR COMPROBANTE DE PAGO" ---
const vistaComprobante = document.getElementById("vista-solicitar-comprobante");
const inputPeriodo = document.getElementById("periodo");
const pickerBtn = document.querySelector(".month-picker-btn");
const dropdown = document.querySelector(".month-picker-dropdown");
const yearDisplay = dropdown.querySelector(".year-display");
const prevYearBtn = dropdown.querySelector(".prev-year");
const nextYearBtn = dropdown.querySelector(".next-year");
const monthsGrid = dropdown.querySelector(".months-grid");
const meses = [
    "ene.",
    "feb.",
    "mar.",
    "abr.",
    "may.",
    "jun.",
    "jul.",
    "ago.",
    "sep.",
    "oct.",
    "nov.",
    "dic.",
];

let currentYear = new Date().getFullYear();
let selectedMonth = new Date().getMonth();

function updateYearDisplay() {
    yearDisplay.textContent = currentYear;
}

function updateInput() {
    inputPeriodo.value = `${meses[selectedMonth]}${currentYear}`;

    // Marcar el mes seleccionado
    monthsGrid
        .querySelectorAll(".month")
        .forEach((m) => m.classList.remove("selected"));
    const selectedMonthDiv = monthsGrid.querySelector(
        `.month[data-month="${selectedMonth}"]`
    );
    if (selectedMonthDiv) {
        selectedMonthDiv.classList.add("selected");
    }
}

// Evento para mostrar/ocultar el dropdown
[inputPeriodo, pickerBtn].forEach((el) => {
    el.addEventListener("click", (e) => {
        e.stopPropagation();
        const isVisible = dropdown.style.display === "block";
        dropdown.style.display = isVisible ? "none" : "block";
    });
});

// Eventos para cambiar de año
prevYearBtn.addEventListener("click", () => {
    currentYear--;
    updateYearDisplay();
});
nextYearBtn.addEventListener("click", () => {
    currentYear++;
    updateYearDisplay();
});

// Evento para seleccionar un mes
monthsGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("month")) {
        selectedMonth = parseInt(e.target.dataset.month);
        updateInput();
        dropdown.style.display = "none";
    }
});

// Ocultar dropdown si se hace clic fuera
document.addEventListener("click", (e) => {
    if (
        !dropdown.contains(e.target) &&
        e.target !== inputPeriodo &&
        e.target !== pickerBtn
    ) {
        dropdown.style.display = "none";
    }
});

// Inicialización
updateYearDisplay();
updateInput();

// --- INICIO: LÓGICA PARA EL PANEL DE COMUNICACIONES ---
document.addEventListener("DOMContentLoaded", function () {
    const modalEditar = document.getElementById("modalEditarSuscriptor");
    const formEditarSuscriptor = document.getElementById(
        "form-editar-suscriptor"
    );
    const tablaSuscriptoresBody = document.querySelector(
        "#vista-lista-suscriptores .unified-table tbody"
    );

    // 1. Usar delegación de eventos para los botones "Editar"
    if (tablaSuscriptoresBody) {
        tablaSuscriptoresBody.addEventListener("click", function (e) {
            // Busca si el clic fue en un botón de editar
            const editButton = e.target.closest('a[href="#"]'); // Selector más genérico
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

    // 2. Función para abrir el modal y poblarlo con datos
    async function abrirModalEditar(nuid) {
        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/suscriptor/${nuid}`
            );
            if (!respuesta.ok) {
                throw new Error(
                    "No se pudieron cargar los datos del suscriptor."
                );
            }
            const data = await respuesta.json();

            // Poblar campos del formulario
            document.getElementById("edit-nuid").value = data.nuid;
            document.getElementById("edit-numeroDocumento").value =
                data.szNumeroDocumento;

            // Formatear fecha para el input tipo 'date' (YYYY-MM-DD)
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

            // Poblar y seleccionar los <select>
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

    // Función auxiliar para poblar los <select>
    function populateSelect(selectId, optionsString, selectedValue) {
        const select = document.getElementById(selectId);
        select.innerHTML = ""; // Limpiar opciones anteriores
        const options = optionsString.split(";");
        options.forEach((opt) => {
            const [value, text] = opt.split(":");
            const optionEl = document.createElement("option");
            optionEl.value = value;
            optionEl.textContent = text;
            if (value == selectedValue) {
                optionEl.selected = true;
            }
            select.appendChild(optionEl);
        });
    }

    // 3. Manejar el envío del formulario de edición
    formEditarSuscriptor.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nuid = document.getElementById("edit-nuid").value;

        // Recopilar todos los datos del formulario en un objeto
        const formData = {
            tipoDocumento: document.getElementById("edit-tipoDocumento").value,
            numeroDocumento: document.getElementById("edit-numeroDocumento")
                .value,
            fechaExpedicion: document.getElementById("edit-fechaExpedicion")
                .value,
            primerNombre: document.getElementById("edit-primerNombre").value,
            segundoNombre: document.getElementById("edit-segundoNombre").value,
            primerApellido: document.getElementById("edit-primerApellido")
                .value,
            segundoApellido: document.getElementById("edit-segundoApellido")
                .value,
            email: document.getElementById("edit-email").value,
            telefonoPrincipal: document.getElementById("edit-telefonoPrincipal")
                .value,
            apellidoCasada: document.getElementById("edit-apellidoCasada")
                .value,
            telefonoSecundario: document.getElementById(
                "edit-telefonoSecundario"
            ).value,
            numeroContrato: document.getElementById("edit-numeroContrato")
                .value,
            direccionServicio: document.getElementById("edit-direccionServicio")
                .value,
            nombrePredio: document.getElementById("edit-nombrePredio").value,
            estrato: document.getElementById("edit-estratoSocioeconomico")
                .value,
            claseUso: document.getElementById("edit-claseUsoInmueble").value,
            estadoCliente: document.getElementById("edit-estadoCliente").value,
        };

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/suscriptor/${nuid}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.message || "Error al guardar los cambios."
                );
            }

            alert(resultado.message); // Muestra el mensaje de éxito del servidor
            modalEditar.classList.remove("show");
            cargarSuscriptores(); // Recargar la lista para reflejar los cambios
        } catch (error) {
            console.error("Error en el envío:", error);
            alert(error.message);
        }
    });

    // --- FIN: LÓGICA PARA EL MODAL DE EDITAR SUSCRIPTOR ---
    const formComunicado = document.getElementById("form-comunicado");
    const comunicadoImagenInput = document.getElementById("comunicadoImagen");
    const comunicadoPreview = document.getElementById("comunicadoPreview");
    const tablaComunicadosBody = document.getElementById(
        "tabla-comunicados-body"
    );
    const placeholderImage = "Iconos/placeholder-image.png"; // Ruta a tu imagen de placeholder

    // 1. Lógica para la previsualización de la imagen
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

    // 2. Lógica para el envío del formulario y creación de la fila en la tabla
    if (formComunicado) {
        formComunicado.addEventListener("submit", function (e) {
            e.preventDefault(); // Evitar el envío real del formulario

            // Obtener valores del formulario
            const titulo = document.getElementById("comunicadoTitulo").value;
            const imagenSrc = comunicadoPreview.src;
            const fechaInicioValue =
                document.getElementById("comunicadoInicio").value;
            const fechaFinValue =
                document.getElementById("comunicadoFin").value;

            // Validar que las fechas no estén vacías
            if (!fechaInicioValue || !fechaFinValue) {
                alert("Por favor, seleccione las fechas de inicio y fin.");
                return;
            }

            const fechaInicio = new Date(fechaInicioValue + "T00:00:00");
            const fechaFin = new Date(fechaFinValue + "T23:59:59");
            const hoy = new Date();

            // Determinar el estado
            let estadoTexto = "";
            let estadoClase = "";
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

            // Formatear fechas para mostrar en la tabla
            const opcionesFecha = {
                day: "2-digit",
                month: "short",
                year: "numeric",
            };
            const periodo = `${fechaInicio.toLocaleDateString(
                "es-ES",
                opcionesFecha
            )} - ${fechaFin.toLocaleDateString("es-ES", opcionesFecha)}`;

            // Crear la nueva fila (TR)
            const nuevaFila = document.createElement("tr");
            nuevaFila.innerHTML = `
                <td data-title="IMAGEN"><img src="${imagenSrc}" alt="${titulo}" class="comunicado-thumbnail"/></td>
                <td data-title="TÍTULO">${titulo}</td>
                <td data-title="PERIODO">${periodo}</td>
                <td data-title="ESTADO"><span class="${estadoClase}">${estadoTexto}</span></td>
                <td data-title="ACCIONES"><a href="#" class="action-delete" onclick="eliminarFila(this)"><i class="fa fa-trash-o"></i> Eliminar</a></td>
            `;

            // Añadir la nueva fila al principio de la tabla
            if (tablaComunicadosBody) {
                tablaComunicadosBody.prepend(nuevaFila);
            }

            // Resetear el formulario
            formComunicado.reset();
            comunicadoPreview.src = placeholderImage; // Restaurar la imagen de placeholder
            alert("Campaña guardada y programada con éxito.");
        });
    }
    // --- INICIO: LÓGICA PARA EL FORMULARIO DE IMPORTAR LECTURAS (CON VALIDACIÓN) ---
    const fileUploadInput = document.getElementById("file-upload");
    const fileNameDisplay = document.getElementById("file-name");
    const importForm = document.getElementById("form-importar-lecturas");
    const processButton = document.getElementById("btn-procesar-archivo");
    const errorMessageDiv = document.getElementById("file-error-message");

    if (
        fileUploadInput &&
        fileNameDisplay &&
        processButton &&
        errorMessageDiv
    ) {
        fileUploadInput.addEventListener("change", () => {
            // Limpiar errores y estado previos
            errorMessageDiv.textContent = "";
            processButton.disabled = true;

            if (fileUploadInput.files.length > 0) {
                const fileName = fileUploadInput.files[0].name;
                const fileExtension = fileName.split(".").pop().toLowerCase();
                const allowedExtensions = ["csv", "xls", "xlsx"];

                if (allowedExtensions.includes(fileExtension)) {
                    // Extensión Válida
                    fileNameDisplay.textContent = fileName;
                    fileNameDisplay.style.fontStyle = "normal";
                    processButton.disabled = false; // Habilitar el botón de procesar
                } else {
                    // Extensión Inválida
                    errorMessageDiv.textContent = `La extensión de archivo "${fileExtension}" no está permitida. Las extensiones permitidas son: csv, xls, xlsx.`;
                    fileNameDisplay.textContent = "Ningún archivo seleccionado";
                    fileNameDisplay.style.fontStyle = "italic";
                    fileUploadInput.value = ""; // Limpiar el archivo inválido del input
                }
            } else {
                fileNameDisplay.textContent = "Ningún archivo seleccionado";
                fileNameDisplay.style.fontStyle = "italic";
            }
        });
    }

    if (importForm) {
        importForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert(
                `Archivo "${fileNameDisplay.textContent}" enviado para procesamiento.`
            );

            // Limpiar el formulario después del envío
            importForm.reset();
            fileNameDisplay.textContent = "Ningún archivo seleccionado";
            fileNameDisplay.style.fontStyle = "italic";
            if (processButton) {
                processButton.disabled = true;
            }

            // Aquí se añadiría la lógica real de subida del archivo con Fetch API
        });
    }
    // --- FIN: LÓGICA PARA EL FORMULARIO DE IMPORTAR LECTURAS ---

    // --- INICIO: LÓGICA PARA EL FORMULARIO DE IMPORTAR PAGOS ---
    const pagosFileUploadInput = document.getElementById("pagos-file-upload");
    const pagosFileNameDisplay = document.getElementById("pagos-file-name");
    const importPagosForm = document.getElementById("form-importar-pagos");
    const processPagosButton = document.getElementById("btn-procesar-pagos");
    const errorPagosMessageDiv = document.getElementById(
        "pagos-file-error-message"
    );
    const btnVolverPagos = document.getElementById("btn-volver-import-pagos");

    if (
        pagosFileUploadInput &&
        pagosFileNameDisplay &&
        processPagosButton &&
        errorPagosMessageDiv
    ) {
        pagosFileUploadInput.addEventListener("change", () => {
            // Limpiar errores y estado previos
            errorPagosMessageDiv.textContent = "";
            processPagosButton.disabled = true;

            if (pagosFileUploadInput.files.length > 0) {
                const fileName = pagosFileUploadInput.files[0].name;
                const fileExtension = fileName.split(".").pop().toLowerCase();
                const allowedExtensions = ["csv", "xls", "xlsx"];

                if (allowedExtensions.includes(fileExtension)) {
                    // Extensión Válida
                    pagosFileNameDisplay.textContent = fileName;
                    processPagosButton.disabled = false;
                } else {
                    // Extensión Inválida
                    errorPagosMessageDiv.textContent = `La extensión de archivo "${fileExtension}" no está permitida.`;
                    pagosFileNameDisplay.textContent =
                        "Sin archivos seleccionados";
                    pagosFileUploadInput.value = ""; // Limpiar el archivo inválido del input
                }
            } else {
                pagosFileNameDisplay.textContent = "Sin archivos seleccionados";
            }
        });
    }

    if (importPagosForm) {
        importPagosForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert(
                `Archivo de pagos "${pagosFileNameDisplay.textContent}" enviado para procesamiento.`
            );

            // Limpiar el formulario después del envío
            importPagosForm.reset();
            pagosFileNameDisplay.textContent = "Sin archivos seleccionados";
            if (processPagosButton) {
                processPagosButton.disabled = true;
            }
        });
    }

    if (btnVolverPagos) {
        btnVolverPagos.addEventListener("click", () => {
            // Navega a la vista anterior o a una por defecto, como la de importar lecturas
            mostrarVista("vista-importar-lecturas");
        });
    }
    // --- FIN: LÓGICA PARA EL FORMULARIO DE IMPORTAR PAGOS ---
    // --- INICIO: LÓGICA PARA EL FORMULARIO DE IMPORTAR OTROS CARGOS ---
    const cargosFileUploadInput = document.getElementById("cargos-file-upload");
    const cargosFileNameDisplay = document.getElementById("cargos-file-name");
    const importCargosForm = document.getElementById("form-importar-cargos");
    const processCargosButton = document.getElementById("btn-procesar-cargos");
    const errorCargosMessageDiv = document.getElementById(
        "cargos-file-error-message"
    );
    const btnVolverCargos = document.getElementById("btn-volver-import-cargos");

    if (
        cargosFileUploadInput &&
        cargosFileNameDisplay &&
        processCargosButton &&
        errorCargosMessageDiv
    ) {
        cargosFileUploadInput.addEventListener("change", () => {
            // Limpiar errores y estado previos
            errorCargosMessageDiv.textContent = "";
            processCargosButton.disabled = true;

            if (cargosFileUploadInput.files.length > 0) {
                const fileName = cargosFileUploadInput.files[0].name;
                const fileExtension = fileName.split(".").pop().toLowerCase();
                // Validación específica para CSV como se indica en la captura de pantalla
                const allowedExtensions = ["csv"];

                if (allowedExtensions.includes(fileExtension)) {
                    // Extensión Válida
                    cargosFileNameDisplay.textContent = fileName;
                    processCargosButton.disabled = false;
                } else {
                    // Extensión Inválida
                    errorCargosMessageDiv.textContent = `La extensión de archivo "${fileExtension}" no está permitida. Solo se aceptan archivos .csv.`;
                    cargosFileNameDisplay.textContent =
                        "Sin archivos seleccionados";
                    cargosFileUploadInput.value = ""; // Limpiar el archivo inválido del input
                }
            } else {
                cargosFileNameDisplay.textContent =
                    "Sin archivos seleccionados";
            }
        });
    }

    if (importCargosForm) {
        importCargosForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert(
                `Archivo de otros cargos "${cargosFileNameDisplay.textContent}" enviado para procesamiento.`
            );

            // Limpiar el formulario después del envío
            importCargosForm.reset();
            cargosFileNameDisplay.textContent = "Sin archivos seleccionados";
            if (processCargosButton) {
                processCargosButton.disabled = true;
            }
        });
    }

    if (btnVolverCargos) {
        btnVolverCargos.addEventListener("click", () => {
            // Navega a la vista anterior o a una por defecto
            mostrarVista("vista-importar-pagos");
        });
    }
    // --- FIN: LÓGICA PARA EL FORMULARIO DE IMPORTAR OTROS CARGOS ---
});

// 3. Función global para eliminar una fila (puedes ponerla fuera del DOMContentLoaded)
function eliminarFila(boton) {
    // Confirmación antes de eliminar
    if (confirm("¿Estás seguro de que quieres eliminar esta campaña?")) {
        const filaAEliminar = boton.closest("tr");
        if (filaAEliminar) {
            filaAEliminar.remove();
        }
    }
}
// --- FIN: LÓGICA PARA EL PANEL DE COMUNICACIONES ---

// Función para cargar suscriptores desde la base de datos vía API Node.js
async function cargarSuscriptores() {
    const tablaBody = document.querySelector(
        "#vista-lista-suscriptores .unified-table tbody"
    );
    if (!tablaBody) return;

    tablaBody.innerHTML =
        '<tr><td colspan="11" style="text-align:center;">Cargando suscriptores...</td></tr>';

    try {
        // ¡Importante! La URL ahora apunta a nuestro servidor Node.js
        const respuesta = await fetch("http://localhost:3000/api/suscriptores");

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const suscriptores = await respuesta.json();
        tablaBody.innerHTML = ""; // Limpiar la tabla

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
                    <td data-title="ESTADO">
                        <span class="status-activo">${s.estado || "N/A"}</span>
                    </td>
                    <th scope="row" data-title="SUSCRIPTOR">
                        ${nombreCompleto}
                        <small style="display: block; color: #6c757d; font-weight: normal;">NUID: ${
                            s.nuid || "N/A"
                        }</small>
                    </th>
                    <td data-title="NUID">${s.nuid || "N/A"}</td>
                    <td data-title="IDENTIFICACIÓN">
                        <span class="identificacion-tipo">${
                            s.tipo_documento || ""
                        }</span>
                        <span class="identificacion-numero">${
                            s.identificacion || "N/A"
                        }</span>
                    </td>
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
                </tr>
            `;
            tablaBody.innerHTML += filaHtml;
        });
    } catch (error) {
        console.error("Error al cargar los suscriptores:", error);
        tablaBody.innerHTML = `<tr><td colspan="11" style="text-align:center;">Error al conectar con el servidor. ¿Iniciaste el servidor con 'node server.js'?</td></tr>`;
    }
}

//  Inicio función para cargar estos datos y llama a esa función cuando se seleccione la vista "Registrar Lecturas".

// Archivo: script.js

async function cargarSuscriptoresParaLectura() {
    const tablaBody = document.querySelector(
        "#vista-registrar-lecturas .unified-table tbody"
    );
    if (!tablaBody) return;

    tablaBody.innerHTML = '<tr><td colspan="10">Cargando...</td></tr>'; // Colspan ajustado a 10

    try {
        const respuesta = await fetch(
            "http://localhost:3000/api/suscriptores-para-lectura"
        );
        const suscriptores = await respuesta.json();
        tablaBody.innerHTML = "";

        if (suscriptores.length === 0) {
            tablaBody.innerHTML =
                '<tr><td colspan="10">No hay suscriptores activos para registrar lecturas.</td></tr>'; // Colspan ajustado a 10
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
                    <td data-title="CICLO">${
                        s.ciclo || "No asignado"
                    }</td> <td data-title="ESTRATO">Estrato ${
                s.estrato || "N/A"
            }</td>
                    <td data-title="DIRECCIÓN">${s.direccion || "N/A"}</td>
                    <td data-title="CELULAR">${s.celular || "N/A"}</td>
                    <td data-title="ÚLTIMA MEDICIÓN COBRADA" class="text-right">${
                        s.ultimaMedicion || 0
                    }</td>
                    <td data-title="Acciones">
                        <div class="table-actions-vertical-buttons">
                            <button class="btn btn-primary btn-sm btn-agregar-lectura">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                                Agregar Lectura
                            </button>
                            <button class="btn btn-warning btn-sm btn-cambiar-medidor">
                                <i class="fa fa-refresh" aria-hidden="true"></i>
                                Cambiar medidor
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tablaBody.innerHTML += filaHtml;
        });
    } catch (error) {
        console.error("Error al cargar suscriptores para lectura:", error);
        tablaBody.innerHTML =
            '<tr><td colspan="10" style="text-align:center;">Error al conectar con el servidor.</td></tr>'; // Colspan ajustado a 10
    }
}
// Fin función para cargar estos datos y llama a esa función cuando se seleccione la vista "Registrar Lecturas".

// Archivo: script.js

document.addEventListener("DOMContentLoaded", function () {
    // --- INICIO: LÓGICA PARA EL MODAL DE AGREGAR LECTURA ---

    const modalLectura = document.getElementById("modalAgregarLectura");
    const formAgregarLectura = document.getElementById("form-agregar-lectura");
    const vistaRegistrarLecturas = document.getElementById(
        "vista-registrar-lecturas"
    );

    // Inputs del modal
    const modalLecturaTitulo = document.getElementById("modalLecturaTitulo");
    const inputLecturaAnterior = document.getElementById("lectura-anterior");
    const inputLecturaActual = document.getElementById("lectura-actual");
    const inputFechaLectura = document.getElementById("fecha-lectura");
    const inputConsumoCalculado = document.getElementById("consumo-calculado");
    const inputIdMedidor = document.getElementById("lectura-id-medidor");
    const lecturaWarning = document.getElementById("lectura-warning");

    // Inicializar Flatpickr para el campo de fecha
    const pickerFechaLectura = flatpickr(inputFechaLectura, {
        locale: "es",
        dateFormat: "Y-m-d", // Formato AAAA-MM-DD para compatibilidad con la DB
        defaultDate: "today",
    });

    // 1. Abrir el modal al hacer clic en "Agregar Lectura"
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
        // Resetear el formulario y warnings
        formAgregarLectura.reset();
        lecturaWarning.style.display = "none";
        inputLecturaActual.style.borderColor = "";

        try {
            const respuesta = await fetch(
                `http://localhost:3000/api/medidor/${nuid}/ultima-lectura`
            );
            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(data.message || "Error al obtener datos.");
            }

            // Poblar el modal
            modalLecturaTitulo.textContent = `Agregar lectura a: ${nuid} ${data.nombreSuscriptor}`;
            inputLecturaAnterior.value = data.lecturaAnterior;
            inputIdMedidor.value = data.idMedidor;

            modalLectura.classList.add("show");
        } catch (error) {
            console.error("Error:", error);
            alert(error.message);
        }
    }

    // 2. Calcular consumo dinámicamente
    inputLecturaActual.addEventListener("input", function () {
        const anterior = parseFloat(inputLecturaAnterior.value) || 0;
        const actual = parseFloat(this.value) || 0;

        if (actual < anterior) {
            lecturaWarning.style.display = "block";
            inputLecturaActual.style.borderColor = "#dc3545"; // Rojo
            inputConsumoCalculado.value = 0;
        } else {
            lecturaWarning.style.display = "none";
            inputLecturaActual.style.borderColor = ""; // Color por defecto
            inputConsumoCalculado.value = actual - anterior;
        }
    });

    // 3. Enviar el formulario para guardar la lectura
    formAgregarLectura.addEventListener("submit", async function (e) {
        e.preventDefault();

        const anterior = parseFloat(inputLecturaAnterior.value);
        const actual = parseFloat(inputLecturaActual.value);

        if (actual < anterior) {
            alert("Error: La lectura actual no puede ser menor a la anterior.");
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

            if (!respuesta.ok) {
                throw new Error(
                    resultado.message || "Error al guardar la lectura."
                );
            }

            alert(resultado.message);
            modalLectura.classList.remove("show");
            // Aquí podrías agregar una función para recargar la tabla de lecturas
            // recargarTablaDeLecturas();
        } catch (error) {
            console.error("Error al enviar:", error);
            alert(error.message);
        }
    });
    // --- FIN: LÓGICA PARA EL MODAL DE AGREGAR LECTURA ---
    // --- INICIO: LÓGICA PARA EL MODAL DE CAMBIAR MEDIDOR ---
    const modalCambiarMedidor = document.getElementById("modalCambiarMedidor");
    const formCambiarMedidor = document.getElementById("form-cambiar-medidor");

    // Inicializar Flatpickr para el nuevo campo de fecha
    flatpickr("#cambiar-fecha-instalacion", {
        locale: "es",
        dateFormat: "Y-m-d", // Formato AAAA-MM-DD para la base de datos
    });

    // 1. Abrir el modal usando delegación de eventos en la vista de "Registrar Lecturas"
    if (vistaRegistrarLecturas) {
        vistaRegistrarLecturas.addEventListener("click", function (e) {
            // Buscamos si el clic fue en un botón para cambiar medidor
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
        formCambiarMedidor.reset(); // Limpiar el formulario antes de mostrarlo

        try {
            // Usamos el endpoint que ya nos da el nombre del suscriptor y el medidor actual
            const respuesta = await fetch(
                `http://localhost:3000/api/medidor/${nuid}/ultima-lectura`
            );
            const data = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    data.message || "Error al obtener datos del medidor."
                );
            }

            // Poblar los campos del modal con la información obtenida
            document.getElementById(
                "modalCambiarMedidorTitulo"
            ).textContent = `Agregar nuevo contador a: ${nuid} ${data.nombreSuscriptor}`;
            document.getElementById(
                "modalCambiarMedidorInfo"
            ).textContent = `Medidor actual: ${
                data.numeroMedidorActual || "No encontrado"
            }.`;
            document.getElementById("cambiar-medidor-nuid").value = nuid; // Guardamos el NUID en el campo oculto

            modalCambiarMedidor.classList.add("show"); // Mostrar el modal
        } catch (error) {
            console.error("Error al abrir modal de cambio de medidor:", error);
            alert(error.message);
        }
    }

    // 2. Manejar el envío del formulario del modal
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
            nuid: nuid,
            nuevoNumeroMedidor: nuevoNumero,
            lecturaInicial: ultimaMedicion,
            fechaInstalacion: fechaInstalacion,
        };

        // Activamos la llamada real al backend
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
            if (!respuesta.ok) {
                // Si el servidor responde con un error, lo mostramos
                throw new Error(resultado.message);
            }
            alert(resultado.message); // Muestra el mensaje de éxito del servidor
            modalCambiarMedidor.classList.remove("show");
            cargarSuscriptoresParaLectura(); // Recargar la lista para reflejar los cambios
        } catch (error) {
            console.error("Error al cambiar medidor:", error);
            alert(error.message); // Muestra el error al usuario
        }
    });
    // --- FIN: LÓGICA PARA EL MODAL DE CAMBIAR MEDIDOR ---
});
