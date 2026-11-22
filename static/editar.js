
const formulario = document.getElementById("formulario-editar");
const mensaje = document.getElementById("mensaje");

// Obtener el ID de la parada desde la dirección
const partesUrl = window.location.pathname.split("/");
const id = decodeURIComponent(partesUrl[partesUrl.length - 1]);

// Cargar los datos actuales de la parada
async function cargarParada() {
    try {
        const respuesta = await fetch(`/paradas/${encodeURIComponent(id)}`);

        if (!respuesta.ok) {
            throw new Error("No se encontró la parada");
        }

        const parada = await respuesta.json();

        document.getElementById("id").value = parada.id;
        document.getElementById("nombre").value = parada.nombre;
        document.getElementById("colonia").value = parada.colonia;
        document.getElementById("municipio").value = parada.municipio;
        document.getElementById("latitud").value = parada.latitud;
        document.getElementById("longitud").value = parada.longitud;
        document.getElementById("rutas").value = (parada.rutas || []).join(", ");

    } catch (error) {
        mensaje.textContent = error.message;
    }
}

// Guardar los cambios
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const parada = {
        id: id,
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
        const respuesta = await fetch(`/paradas/${encodeURIComponent(id)}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parada)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.detail || "No se pudieron guardar los cambios");
        }

        mensaje.textContent = "¡Parada actualizada correctamente!";

        setTimeout(() => {
            window.location.href = "/";
        }, 1200);

    } catch (error) {
        mensaje.textContent = "Error: " + error.message;
    }
});

// Cargar información al abrir la página
cargarParada();
