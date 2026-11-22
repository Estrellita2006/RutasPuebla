
from fastapi import APIRouter, HTTPException
from app.database import r
from app.models import Parada
from datetime import datetime
import json

router = APIRouter()


@router.get("/paradas/siguiente-id")
def obtener_siguiente_id():
    ids = []

    for clave in r.scan_iter("parada:*"):
        id_actual = clave.split(":")[1]
        if id_actual.isdigit():
            ids.append(int(id_actual))

    return {"siguiente_id": str(max(ids, default=0) + 1)}

# CREAR UNA PARADA


@router.post("/paradas")
def crear_parada(parada: Parada):
    clave = f"parada:{parada.id}"

    if r.exists(clave):
        raise HTTPException(
            status_code=400,
            detail="El ID de la parada ya existe"
        )

    datos = parada.model_dump(mode="json")
    datos["creado_en"] = datetime.now().isoformat()

    r.set(clave, json.dumps(datos))

    return {
        "mensaje": "Parada creada correctamente",
        "parada": datos
    }


# CONSULTAR TODAS LAS PARADAS
@router.get("/paradas")
def obtener_paradas():
    paradas = []

    for clave in r.scan_iter("parada:*"):
        datos = r.get(clave)
        if datos:
            paradas.append(json.loads(datos))

    return paradas


# CONSULTAR UNA PARADA POR ID
@router.get("/paradas/{id}")
def obtener_parada(id: str):
    datos = r.get(f"parada:{id}")

    if not datos:
        raise HTTPException(status_code=404, detail="Parada no encontrada")

    return json.loads(datos)


# ACTUALIZAR UNA PARADA
@router.put("/paradas/{id}")
def actualizar_parada(id: str, parada: Parada):
    clave = f"parada:{id}"

    if not r.exists(clave):
        raise HTTPException(status_code=404, detail="Parada no encontrada")

    datos = parada.model_dump(mode="json")
    datos["id"] = id

    r.set(clave, json.dumps(datos))

    return {
        "mensaje": "Parada actualizada correctamente",
        "parada": datos
    }


# ELIMINAR UNA PARADA
@router.delete("/paradas/{id}")
def eliminar_parada(id: str):
    eliminada = r.delete(f"parada:{id}")

    if not eliminada:
        raise HTTPException(status_code=404, detail="Parada no encontrada")

    return {"mensaje": "Parada eliminada correctamente"}
