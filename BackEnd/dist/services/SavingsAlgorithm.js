// src/services/SavingsAlgorithm.ts
// Importamos las funciones (valores ejecutables) de la capa de servicio de Nessie
import { getRecentPurchases, createTransfer, getAccountDetails } from './NessieService.js';
// Importamos el modelo (valor ejecutable) y el tipo (solo tipo) de Mongoose
import CustomerModel, {} from '../models/Customer.js';
// MOCK: ID de la cuenta simulada que representa el fondo de inversión (ID de Nessie)
const MOCK_INVESTMENT_ACCOUNT_ID = '68fd2f9b9683f20dd51a476b';
const DEFAULT_THRESHOLD = 5.00;
/**
 * Función auxiliar para obtener la configuración del cliente (o crearla con valores por defecto).
 * @param accountId El ID de la cuenta del cliente (Nessie).
 * @returns La configuración del cliente de la DB.
 */
async function getCustomerConfig(accountId) {
    let config = await CustomerModel.findOne({ nessieCustomerId: accountId });
    if (!config) {
        // Si no se encuentra, creamos un registro inicial
        config = new CustomerModel({
            nessieCustomerId: accountId,
            savingsThreshold: DEFAULT_THRESHOLD
        });
        await config.save();
    }
    // Se asegura de que el tipo sea ICustomer
    return config;
}
/**
 * 1. ALGORITMO BATCH (HISTÓRICO)
 * Procesa todas las compras hormiga recientes y ejecuta una ÚNICA transferencia.
 */
export async function processHormigaSavings(customerAccountId) {
    // 1. Obtener la configuración del umbral desde la DB
    const customerConfig = await getCustomerConfig(customerAccountId);
    const currentThreshold = customerConfig.savingsThreshold;
    if (currentThreshold <= 0) {
        return {
            message: 'Umbral de ahorro no configurado o inválido.',
            transferredAmount: 0,
            purchasesCount: 0,
        }; // ⬅️ Tipado explícito
    }
    // 2. Obtener las compras recientes del cliente (ej. última semana)
    const recentPurchases = await getRecentPurchases(customerAccountId);
    // 3. Aplicar la lógica del "Gasto Hormiga"
    const hormigaPurchases = recentPurchases.filter((purchase) => purchase.amount > 0 && purchase.amount <= currentThreshold);
    if (hormigaPurchases.length === 0) {
        return {
            message: `No se encontraron gastos hormiga bajo el umbral de $${currentThreshold.toFixed(2)}.`,
            transferredAmount: 0,
            purchasesCount: 0,
        }; // ⬅️ Tipado explícito
    }
    // 4. Calcular el "Costo Doble" total
    const totalAmountToTransfer = hormigaPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);
    // 5. Ejecutar la transferencia simulada
    try {
        const transferResult = await createTransfer(customerAccountId, MOCK_INVESTMENT_ACCOUNT_ID, totalAmountToTransfer);
        return {
            message: 'Ahorro Hormiga (Batch) procesado exitosamente.',
            transferredAmount: totalAmountToTransfer.toFixed(2),
            purchasesCount: hormigaPurchases.length,
            transferId: transferResult._id,
        }; // ⬅️ Tipado explícito
    }
    catch (error) {
        console.error('Fallo el proceso de ahorro hormiga (Batch):', error);
        throw new Error('Error al ejecutar la transferencia del ahorro hormiga (Batch).');
    }
}
/**
 * 2. ALGORITMO TIEMPO REAL (ESPEJO)
 * Procesa una compra individual, valida el saldo disponible y ejecuta la transferencia espejo.
 */
export async function processMirrorSavings(customerAccountId, purchaseAmount) {
    // 1. Obtener la configuración del umbral desde la DB
    const customerConfig = await getCustomerConfig(customerAccountId);
    const currentThreshold = customerConfig.savingsThreshold;
    const amountToMirror = purchaseAmount;
    // 2. Verificar si el monto es un Gasto Hormiga válido
    if (amountToMirror <= 0 || amountToMirror > currentThreshold) {
        return {
            message: `La compra de $${amountToMirror.toFixed(2)} no califica como gasto hormiga (Umbral: $${currentThreshold.toFixed(2)}).`,
            transferredAmount: 0,
            validation: 'SKIP',
        }; // ⬅️ Tipado explícito y correcto
    }
    // 3. Obtener Saldo Actual y Validar Fondos
    const accountInfo = await getAccountDetails(customerAccountId);
    const currentBalance = accountInfo.balance;
    if (currentBalance < amountToMirror) {
        console.warn(`Saldo de $${currentBalance} insuficiente para espejo de $${amountToMirror}.`);
        return {
            message: `Saldo insuficiente ($${currentBalance.toFixed(2)}) para el ahorro espejo de $${amountToMirror.toFixed(2)}.`,
            transferredAmount: 0,
            validation: 'FAILED_BALANCE', // ⬅️ Tipo literal de la unión
        }; // ⬅️ Tipado explícito
    }
    // 4. Ejecutar la Transferencia Espejo
    try {
        const transferResult = await createTransfer(customerAccountId, MOCK_INVESTMENT_ACCOUNT_ID, amountToMirror);
        return {
            message: 'Ahorro espejo procesado exitosamente.',
            transferredAmount: amountToMirror.toFixed(2),
            validation: 'SUCCESS', // ⬅️ Tipo literal de la unión
            transferId: transferResult._id,
        }; // ⬅️ Tipado explícito
    }
    catch (error) {
        console.error('Fallo la transferencia del ahorro espejo:', error);
        throw new Error('Error al ejecutar la transferencia del ahorro espejo.');
    }
}
