// src/services/NessieService.ts
// Ya no necesitamos axios para llamadas reales, pero lo conservamos para isAxiosError en el catch
import axios from 'axios';
// Importamos solo tipos
import {} from '../types/nessie.js';
// MOCKS DE DATOS
// Estos datos simulan lo que Nessie devolvería
const MOCK_ACCOUNT_BALANCE = 1000.00; // Saldo inicial alto para la cuenta del cliente
const MOCK_TRANSFER_ID = "mock_transfer_9999";
const MOCK_CUSTOMER_ACCOUNT_ID = '66778899aabbccddeeff0011'; // ID del cliente para el mock
// No necesitamos la URL ni la clave si no llamamos a la API
// const NESSY_BASE_URL = 'http://api.nessieisreal.com';
// const NESSY_API_KEY = process.env.NESSY_API_KEY || '';
/**
 * [MOCK] Obtiene las compras recientes simuladas.
 * Devuelve un array con compras pequeñas (gastos hormiga) y una grande.
 */
export async function getRecentPurchases(accountId) {
    console.log("MOCK: Obteniendo compras recientes...");
    // Simular varias compras hormiga (<= 5.00) y una grande (> 5.00)
    const mockPurchases = [
        { _id: 'p1', type: 'purchase', purchase_date: new Date().toISOString(), amount: 1.50, description: 'Café', status: 'completed', merchant_id: 'm1', account_id: accountId },
        { _id: 'p2', type: 'purchase', purchase_date: new Date().toISOString(), amount: 3.20, description: 'Snack', status: 'completed', merchant_id: 'm1', account_id: accountId },
        { _id: 'p3', type: 'purchase', purchase_date: new Date().toISOString(), amount: 12.99, description: 'Almuerzo grande', status: 'completed', merchant_id: 'm2', account_id: accountId }, // No hormiga
        { _id: 'p4', type: 'purchase', purchase_date: new Date().toISOString(), amount: 4.90, description: 'Helado', status: 'completed', merchant_id: 'm3', account_id: accountId },
    ];
    // Simplemente devuelve los datos sin llamar a Axios
    return Promise.resolve(mockPurchases);
}
/**
 * [MOCK] Simula la creación exitosa de una transferencia.
 */
export async function createTransfer(fromAccountId, toAccountId, amount) {
    console.log(`MOCK: Transferencia simulada de $${amount.toFixed(2)} a ${toAccountId}.`);
    // Simula una respuesta exitosa de la API
    const mockTransfer = {
        _id: MOCK_TRANSFER_ID,
        type: 'transfer',
        transaction_date: new Date().toISOString(),
        amount: amount,
        description: `MOCK Ahorro Hormiga - Transferencia de $${amount.toFixed(2)}`,
        status: 'pending',
        payer_id: fromAccountId,
        payee_id: toAccountId,
    };
    return Promise.resolve(mockTransfer);
}
/**
 * [MOCK] Obtiene los detalles de una cuenta simulada.
 * Esto evita el error 401 de Nessie.
 */
export async function getAccountDetails(accountId) {
    console.log("MOCK: Obteniendo saldo de cuenta...");
    // Simula una cuenta con saldo suficiente
    const mockAccount = {
        _id: accountId,
        type: 'Savings',
        nickname: 'Cuenta Hackathon MOCK',
        rewards: 500,
        balance: MOCK_ACCOUNT_BALANCE, // Usar la variable de saldo mockeado
        customer_id: 'MOCK_CUSTOMER_ID'
    };
    return Promise.resolve(mockAccount);
}
