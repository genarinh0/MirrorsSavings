# -*- coding: utf-8 -*-
# Servicio API de Python para exponer el modelo de ML

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import uvicorn
import os

# ====================================================================
# 1. CONFIGURACIÓN E INICIALIZACIÓN
# ====================================================================

app = FastAPI(
    title="Gasto Hormiga Classifier API",
    description="Servicio de clasificación para determinar si un gasto es 'hormiga' (1) o 'normal' (0).",
    version="1.0.0"
)

# Rutas de los archivos guardados (deben ser accesibles)
MODEL_PATH = 'gasto_hormiga_model.pkl'
PREPROCESSOR_PATH = 'gasto_hormiga_preprocessor.pkl'

# Variables globales para el modelo
model = None
preprocessor = None

# Definición del esquema de datos que la API recibirá
class GastoData(BaseModel):
    precio: float
    categoria: str
    tienda: str

def load_model_components():
    """Carga el modelo y el preprocesador antes de iniciar la API."""
    global model, preprocessor

    if not os.path.exists(MODEL_PATH) or not os.path.exists(PREPROCESSOR_PATH):
        raise FileNotFoundError(
            f"No se encontraron los archivos del modelo: {MODEL_PATH} o {PREPROCESSOR_PATH}. "
            "Asegúrate de ejecutar train_model.py primero."
        )

    try:
        model = joblib.load(MODEL_PATH)
        preprocessor = joblib.load(PREPROCESSOR_PATH)
        print("✅ Modelo y preprocesador cargados exitosamente.")
    except Exception as e:
        raise Exception(f"Fallo al cargar componentes de ML: {e}")

# Ejecutar la carga antes de iniciar la aplicación
try:
    load_model_components()
except FileNotFoundError as e:
    print(e)
    model = None # Asegura que el modelo está None si falla la carga

# ====================================================================
# 2. ENDPOINT DE PREDICCIÓN
# ====================================================================

@app.post("/predict", tags=["Predicción"])
def predict_gasto(gasto: GastoData):
    """
    Recibe los datos de un gasto y devuelve la clasificación (0 o 1).
    """
    if model is None or preprocessor is None:
        raise HTTPException(status_code=500, detail="Modelo de ML no cargado. Ejecute el entrenamiento primero.")

    try:
        # Crear DataFrame con el input
        new_data = pd.DataFrame([[gasto.precio, gasto.categoria, gasto.tienda]],
                                columns=['precio', 'categoria', 'tienda'])

        # 1. Aplicar el mismo preprocesamiento
        processed_data = preprocessor.transform(new_data)

        # 2. Convertir a matriz densa si es necesario (para GaussianNB)
        if hasattr(processed_data, 'toarray'):
            processed_data = processed_data.toarray()

        # 3. Realizar la predicción
        prediction = model.predict(processed_data)[0]

        # Devolver la clasificación (1 si es hormiga, 0 si no)
        return {"is_hormiga": int(prediction)}

    except Exception as e:
        print(f"Error en la predicción: {e}")
        raise HTTPException(status_code=500, detail="Error interno al procesar la predicción.")

# ====================================================================
# 3. COMANDO DE INICIO
# ====================================================================

# Para iniciar esta API:
# uvicorn ml_api_service:app --reload --port 8000
