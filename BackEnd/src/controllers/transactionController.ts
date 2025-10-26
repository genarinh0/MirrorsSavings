import type { Request, Response } from 'express';
import TransactionModel from '../models/Transaction.js';

const MOCK_CUSTOMER_ACCOUNT_ID = 'TEST_HACKATHON_USER';

const getTargetAccountId = (req: Request): string => {
    return req.params.accountId || req.body.accountId || MOCK_CUSTOMER_ACCOUNT_ID;
};

/**
 * [POST /api/transactions] ⬅️ Guarda la transacción en MongoDB.
 * Llamada desde frontend/src/utils/api.js -> saveTransaction
 */
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
    const {
        monto, categoria, establecimiento, accountId,
        isHormiga, transferAmount, validation, message
    } = req.body;

    // Usamos el ID del cliente mock
    const nessieCustomerId = getTargetAccountId(req);

    try {
        const newTransaction = await TransactionModel.create({
            nessieCustomerId,
            monto,
            categoria,
            establecimiento,
            isHormiga,
            transferAmount,
            validation,
            message,
            // Fecha se usa el default: Date.now
        });

        console.log(`✅ Transacción guardada en DB: ${newTransaction._id}`);
        res.status(201).json({ success: true, transaction: newTransaction });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al guardar la transacción.';
        console.error("Error al crear transacción:", errorMessage);
        res.status(500).json({ success: false, error: errorMessage });
    }
};

/**
 * [GET /api/transactions/:accountId] ⬅️ Obtiene el historial.
 * Llamada desde frontend/src/utils/api.js -> getHistory
 */
export const getTransactionsByAccount = async (req: Request, res: Response): Promise<void> => {
    const nessieCustomerId = getTargetAccountId(req);

    try {
        // Buscamos todas las transacciones del cliente, ordenadas por fecha descendente
        const history = await TransactionModel.find({ nessieCustomerId })
            .sort({ fecha: -1 }); // -1 para más reciente primero

        res.status(200).json({ success: true, history });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al obtener historial.';
        console.error("Error al obtener historial:", errorMessage);
        res.status(500).json({ success: false, error: errorMessage });
    }
};