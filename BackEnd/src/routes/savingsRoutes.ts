// src/routes/savingsRoutes.ts

import { Router } from 'express';
import * as savingsController from '../controllers/savingsController.js';

const router = Router();

router.get('/status/:accountId', savingsController.getCustomerStatus);
router.post('/mirror', savingsController.mirrorSavings);

export default router;
