
const formulario = document.getElementById("formulario-parada");
const campoId = document.getElementById("id");
const mensaje = document.getElementById("mensaje");

// Consultar el siguiente ID disponible
async function cargarSiguienteId() {
    try {
        const respuesta = await fetch("/paradas/siguiente-id");
        const datos = await respuesta.json();

        campoId.value = datos.siguiente_id;
    } catch (error) {
        mensaje.textContent = "No se pudo consultar el siguiente ID.";
    }
}

// Registrar una parada
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const parada = {
        id: campoId.value,
        nombre: document.getElementById("nombre").value,
        colonia: document.getElementById("colonia").value,
        municipio: document.getElementById("municipio").value,
        latitud: parseFloat(document.getElementById("latitud").value),
        longitud: parseFloat(document.getElementById("longitud").value),
        rutas: document.getElementById("rutas").value
            .split(",")
            .map(ruta => ruta.trim())
            .filter(ruta => ruta !== ""),
        activa: true
    };

    try {
        const respuesta = await fetch("/paradas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parada)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.detail || "No se pudo registrar la parada");
        }

        mensaje.textContent = "¡Parada registrada correctamente!";
        formulario.reset();

        await cargarSiguienteId();

    } catch (error) {
        mensaje.textContent = "Error: " + error.message;
    }
});

// Mostrar el siguiente ID al abrir la página
cargarSiguienteId();
