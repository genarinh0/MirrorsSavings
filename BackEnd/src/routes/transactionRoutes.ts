import { Router } from 'express';
import { createTransaction, getTransactionsByAccount } from '../controllers/transactionController.js';

const router = Router();

// Ruta para guardar una nueva transacción (llamada por saveTransaction en el frontend)
router.post('/', createTransaction);

// Ruta para obtener el historial de un cliente (llamada por getHistory en el frontend)
router.get('/:accountId', getTransactionsByAccount);

export default router;