
// Inicializar el mapa centrado en Puebla
const mapa = L.map('mapa').setView([19.0433, -98.1987], 13);

// Agregar el mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(mapa);

// Grupo para almacenar los marcadores
const marcadores = L.featureGroup().addTo(mapa);

// Guardar las paradas recibidas de la API
let todasLasParadas = [];

// Consultar las paradas desde FastAPI
async function cargarParadas() {
    const contenedor = document.getElementById('paradas');

    try {
        const respuesta = await fetch('/paradas');

        if (!respuesta.ok) {
            throw new Error('No se pudieron consultar las paradas');
        }

        todasLasParadas = await respuesta.json();

        mostrarParadas(todasLasParadas);

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Error al cargar las paradas.</p>';
    }
}

// Mostrar las paradas en la página
function mostrarParadas(paradas) {
    const contenedor = document.getElementById('paradas');

    contenedor.innerHTML = '';
    marcadores.clearLayers();

    if (paradas.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron paradas.</p>';
        return;
    }

    paradas.forEach(parada => {

        // Crear tarjeta de la parada
        const tarjeta = document.createElement('div');
        tarjeta.className = 'parada';

        const nombre = document.createElement('h3');
        nombre.textContent = parada.nombre;

        const colonia = document.createElement('p');
        colonia.textContent = `Colonia: ${parada.colonia}`;

        const municipio = document.createElement('p');
        municipio.textContent = `Municipio: ${parada.municipio}`;

        const rutas = document.createElement('p');
        rutas.textContent = `Rutas: ${(parada.rutas || []).join(', ') || 'Sin rutas registradas'}`;

        const boton = document.createElement('button');
        boton.textContent = 'Ver en mapa';

        boton.addEventListener('click', () => {
            mapa.setView([parada.latitud, parada.longitud], 16);
        });
        
const editar = document.createElement('button');
editar.textContent = 'Editar';

editar.addEventListener('click', () => {
    window.location.href = `/editar/${encodeURIComponent(parada.id)}`;
});

        const eliminar = document.createElement('button');
eliminar.textContent = 'Eliminar';

eliminar.addEventListener('click', async () => {
    const confirmar = confirm(
        `¿Deseas eliminar la parada ${parada.nombre}?`
    );

    if (!confirmar) return;

    try {
        const respuesta = await fetch(
            `/paradas/${encodeURIComponent(parada.id)}`,
            { method: 'DELETE' }
        );

        if (!respuesta.ok) {
            throw new Error('No se pudo eliminar la parada');
        }

        alert('Parada eliminada correctamente');
        cargarParadas();

    } catch (error) {
        alert(error.message);
    }
});

tarjeta.append(nombre, colonia, municipio, rutas, boton, editar, eliminar);
        contenedor.appendChild(tarjeta);

        // Agregar marcador al mapa
        const marcador = L.marker([
            parada.latitud,
            parada.longitud
        ]).addTo(marcadores);

        marcador.bindPopup(`
            <strong>${nombre.textContent}</strong><br>
            ${colonia.textContent}<br>
            ${municipio.textContent}
        `);
    });

    // Ajustar el mapa para mostrar los marcadores
    if (marcadores.getLayers().length > 0) {
        mapa.fitBounds(marcadores.getBounds(), {
            padding: [30, 30],
            maxZoom: 15
        });
    }
}

// Buscar por nombre, colonia o municipio
function buscarParadas() {
    const texto = document.getElementById('buscar').value.trim().toLowerCase();

    const filtradas = todasLasParadas.filter(parada =>
        String(parada.id).toLowerCase().includes(texto) ||
        parada.nombre.toLowerCase().includes(texto) ||
        parada.colonia.toLowerCase().includes(texto) ||
        parada.municipio.toLowerCase().includes(texto)
    );

    mostrarParadas(filtradas);
}

// Mostrar nuevamente todas las paradas
function mostrarTodas() {
    document.getElementById('buscar').value = '';
    mostrarParadas(todasLasParadas);
}

// Conectar el botón Buscar
document.querySelector('.buscador button').addEventListener(
    'click',
    buscarParadas
);

// Cargar las paradas al iniciar la página
cargarParadas();
