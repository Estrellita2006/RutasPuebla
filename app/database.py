
import os
import redis
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

# Obtener la dirección de conexión de Redis Cloud
REDIS_URL = os.getenv("REDIS_URL")

# Crear la conexión
r = redis.from_url(
    REDIS_URL,
    decode_responses=True
)

# Comprobar la conexión
def verificar_conexion():
    try:
        return r.ping()
    except redis.RedisError as error:
        print(f"Error al conectar con Redis: {error}")
        return False
