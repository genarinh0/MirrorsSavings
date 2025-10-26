// src/routes/savingsRoutes.ts
import { Router } from 'express';
// ⬅️ Importamos todas las exportaciones del controlador como un solo objeto.
import * as savingsController from '../controllers/savingsController.js';
const router = Router();
// Ruta para ejecutar el proceso Batch
// Accedemos a la función usando el objeto importado: savingsController.processSavings
router.post('/process', savingsController.processSavings);
// Ruta para configurar el umbral del cliente
// Accedemos a la función usando el objeto importado: savingsController.setSavingsThreshold
router.put('/threshold', savingsController.setSavingsThreshold);
// Ruta para la simulación de tiempo real (ahorro espejo)
// Accedemos a la función usando el objeto importado: savingsController.mirrorSavings
router.post('/mirror', savingsController.mirrorSavings);
export default router;
