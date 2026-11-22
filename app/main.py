
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.routes import router
from app.database import verificar_conexion

app = FastAPI(
    title="Rutas Puebla",
    description="Sistema para consultar paradas de transporte público en Puebla",
    version="1.0.0"
)

# Habilitar archivos CSS y JavaScript
app.mount("/static", StaticFiles(directory="static"), name="static")

# Registrar las rutas de la API
app.include_router(router)


# Mostrar la página principal
@app.get("/")
def inicio():
    return FileResponse("static/index.html")


@app.get("/registrar")
def pagina_registrar():
    return FileResponse("static/registrar.html")

@app.get("/editar/{id}")
def pagina_editar(id: str):
    return FileResponse("static/editar.html")

# Comprobar la conexión con Redis
@app.get("/health")
def health():
    try:
        if verificar_conexion():
            return {
                "estado": "correcto",
                "redis": "conectado"
            }
    except Exception:
        pass

    return {
        "estado": "error",
        "redis": "desconectado"
    }
