// frontend/src/utils/api.js

import axios from 'axios';

// Usamos la ruta relativa que el proxy maneja (apunta a localhost:3001)
const BACKEND_URL = '/api/savings';
const TRANSACTION_URL = '/api/transactions';

// ID FIJO DEL CLIENTE ÚNICO (Debe coincidir con la inserción en MongoDB)
const TEST_ACCOUNT_ID = 'TEST_HACKATHON_USER';

// ==========================================================
// Funciones de Saldo y Ahorro (Persistencia)
// ==========================================================

/**
 * Obtiene el estado persistente del cliente (saldo y ahorro) para el inicio.
 */
export async function getInitialData() {
    try {
        const response = await axios.get(`${BACKEND_URL}/status/${TEST_ACCOUNT_ID}`);
        const data = response.data;
        return {
            ahorroTotal: data.ahorroTotal,
            saldoNormal: data.saldoNormal,
        };
    } catch (error) {
        console.error("Fallo al cargar datos iniciales, usando defaults.", error);
        // Fallback: Si la conexión o la DB falla, usamos valores seguros
        return {
            ahorroTotal: 0.00,
            saldoNormal: 10000.00,
        };
    }
}

/**
 * 2. Llama al backend para ejecutar el algoritmo de ahorro espejo (con datos de ML).
 * @param {number} purchaseAmount - Monto del gasto.
 * @param {string} categoria - Categoría seleccionada.
 * @param {string} establecimiento - Nombre de la tienda.
 */
export async function executeMirrorSavings(purchaseAmount, categoria, establecimiento) {
    try {
        // Esta petición es la que dispara la llamada al servicio de ML en el backend
        const response = await axios.post(`${BACKEND_URL}/mirror`, {
            purchaseAmount,
            categoria,
            establecimiento,
            accountId: TEST_ACCOUNT_ID
        });
        return response.data.data; // Devuelve el objeto de resultado del algoritmo
    } catch (error) {
        // Lanza un error genérico para que el componente lo capture
        throw new Error(error.response?.data?.error || "Fallo la transferencia espejo.");
    }
}


// ==========================================================
// Funciones de Historial (MongoDB)
// ==========================================================

/**
 * 3. Guarda la transacción y el resultado del algoritmo en el historial de la DB.
 * @param {object} result - Resultado del algoritmo (incluye validation y transferredAmount).
 */
export async function saveTransaction(monto, categoria, establecimiento, result) {
    try {
        const payload = {
            monto,
            categoria,
            establecimiento,
            accountId: TEST_ACCOUNT_ID,
            // ⬅️ La lógica del controlador determina si hubo ahorro, aquí guardamos el estado
            isHormiga: result.validation === 'SUCCESS' || result.validation === 'FAILED_MIRROR',
            transferAmount: parseFloat(result.transferredAmount) || 0,
            message: result.message,
            validation: result.validation,
        };

        await axios.post(TRANSACTION_URL, payload);
    } catch (error) {
        console.error("Error al guardar la transacción en el historial:", error);
    }
}

/**
 * 4. Obtiene todo el historial de transacciones para mostrar.
 */
export async function getHistory() {
    try {
        const response = await axios.get(`${TRANSACTION_URL}/${TEST_ACCOUNT_ID}`);
        return response.data.history;
    } catch (error) {
        console.error("Error al obtener el historial:", error);
        return [];
    }
}