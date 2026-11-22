
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class Parada(BaseModel):
    id: str
    nombre: str
    colonia: str
    municipio: str
    latitud: float
    longitud: float
    rutas: List[str] = Field(default_factory=list)
    activa: bool = True
    creado_en: Optional[datetime] = None
