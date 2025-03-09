document.addEventListener("DOMContentLoaded", function(){
    cargarCitas();
    // Event listener para cambiar la visibilidad de campos según el tipo de servicio
    document.getElementById("tipoServicio").addEventListener("change", function(){
        const tipo = this.value;
        const horaInput = document.getElementById("horaCita");
        const fechaSalidaInput = document.getElementById("fechaSalida");
        if (tipo === "hotel") {
            horaInput.style.display = "none";
            fechaSalidaInput.style.display = "block";
        } else {
            horaInput.style.display = "block";
            fechaSalidaInput.style.display = "none";
        }
    });
});

function agregarCita() {
    const nombreCita = document.getElementById("nombreCita").value.trim();
    const tipoServicio = document.getElementById("tipoServicio").value;
    const fechaCita = document.getElementById("fechaCita").value; // Fecha de entrada
    const horaCita = document.getElementById("horaCita").value;
    const fechaSalida = document.getElementById("fechaSalida").value; // Solo para hotel
    const mensajeError = document.getElementById("mensajeError");
    const listadoCitas = document.getElementById("listadoCitas");

    // Validar campos según el servicio seleccionado
    if (nombreCita === "" || fechaCita === "" || 
        ((tipoServicio === "hotel" && fechaSalida === "") || 
         ((tipoServicio === "consulta-medica" || tipoServicio === "consulta-estetica") && horaCita === ""))) {
        mensajeError.textContent = "Por favor llena los campos requeridos.";
        mensajeError.style.display = "block";
        return;
    }

    // Verificar si ya existe una cita con los mismos datos
    let citaDuplicada = false;
    document.querySelectorAll("#listadoCitas li span").forEach(cita => {
        const citaTexto = cita.textContent;
        if (tipoServicio === "hotel") {
            if (citaTexto.includes("Hotel") && citaTexto.includes(fechaCita) && citaTexto.includes(fechaSalida)) {
                citaDuplicada = true;
            }
        } else {
            const servicioLabel = (tipoServicio === "consulta-medica") ? "Consulta Médica" : "Consulta de Estética";
            if (citaTexto.includes(servicioLabel) && citaTexto.includes(fechaCita) && citaTexto.includes(horaCita)) {
                citaDuplicada = true;
            }
        }
    });

    if (citaDuplicada) {
        mensajeError.textContent = "Ya existe una cita con los mismos datos.";
        mensajeError.style.display = "block";
        return;
    }

    mensajeError.style.display = "none"; // Ocultar el mensaje de error si todo está correcto

    // Crear el elemento de la cita según el tipo de servicio
    const li = document.createElement("li");
    let citaInfo = "";
    if (tipoServicio === "hotel") {
        citaInfo = `<span><strong>${nombreCita}</strong> - [Hotel] Entrada: ${fechaCita}, Salida: ${fechaSalida}</span>
                    <button class="borrar-btn btn-small pink waves-effect waves-light" onClick="borrarCita(this)">Eliminar</button>`;
    } else if (tipoServicio === "consulta-medica") {
        citaInfo = `<span><strong>${nombreCita}</strong> - [Consulta Médica] Fecha: ${fechaCita}, Hora: ${horaCita}</span>
                    <button class="borrar-btn btn-small pink waves-effect waves-light" onClick="borrarCita(this)">Eliminar</button>`;
    } else if (tipoServicio === "consulta-estetica") {
        citaInfo = `<span><strong>${nombreCita}</strong> - [Consulta de Estética] Fecha: ${fechaCita}, Hora: ${horaCita}</span>
                    <button class="borrar-btn btn-small pink waves-effect waves-light" onClick="borrarCita(this)">Eliminar</button>`;
    }

    li.innerHTML = citaInfo;
    listadoCitas.appendChild(li);

    guardarCitasEnLocalStorage();

    // Limpiar los campos después de agregar la cita
    document.getElementById("nombreCita").value = "";
    document.getElementById("fechaCita").value = "";
    document.getElementById("horaCita").value = "";
    document.getElementById("fechaSalida").value = "";
}

function borrarCita(elementoCita) {
    elementoCita.parentElement.remove();
    guardarCitasEnLocalStorage();
}

function guardarCitasEnLocalStorage() {
    const citas = [];
    // Para simplificar, almacenamos el texto que se muestra en la cita
    document.querySelectorAll("#listadoCitas li").forEach(cita => {
        const citaSpan = cita.querySelector("span").innerText;
        citas.push(citaSpan);
    });
    localStorage.setItem("CitasGuardadas", JSON.stringify(citas));
}

function cargarCitas() {
    const citas = JSON.parse(localStorage.getItem("CitasGuardadas")) || [];
    const listadoCitas = document.getElementById("listadoCitas");
    listadoCitas.innerHTML = "";
    citas.forEach(citaTexto => {
        const li = document.createElement("li");
        li.innerHTML = `<span>${citaTexto}</span>
                        <button class="borrar-btn btn-small teal waves-effect waves-light" onClick="borrarCita(this)">Eliminar</button>`;
        listadoCitas.appendChild(li);
    });
}

function toggleReservas() {
    const listadoCitas = document.getElementById("listadoCitas");
    const botonReservas = document.getElementById("btnReservas");

    if (listadoCitas.style.display === "none" || listadoCitas.style.display === "") {
        listadoCitas.style.display = "block";
        botonReservas.textContent = "Esconder reservas";
    } else {
        listadoCitas.style.display = "none";
        botonReservas.textContent = "Ver reservas";
    }
}

const inputNombreCita = document.getElementById("nombreCita");
inputNombreCita.addEventListener("keypress", function (tecla) {
    if (tecla.key === "Enter") {
        agregarCita();
    }
});
