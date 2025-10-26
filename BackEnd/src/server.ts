// src/server.ts (CORREGIDO PARA INICIO ASÍNCRONO)

import express from 'express';
import type { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import connectDB from './config/db.js';
import savingsRoutes from './routes/savingsRoutes.js';
import cors from 'cors'; // Aseguramos que cors se esté usando
import transactionRoutes from './routes/transactionRoutes.js';


dotenv.config();

const PORT = process.env.PORT || 3001; // Usamos el puerto 3001 para el backend

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/transactions', transactionRoutes);

// Rutas de Salud
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('Servidor Ahorro Hormiga funcionando!');
});

// Rutas del proyecto
app.use('/api/savings', savingsRoutes);
// Nota: Las rutas de historial deben estar definidas en server.ts si las creaste.

// ⬅️ FUNCIÓN PRINCIPAL ASÍNCRONA
const startServer = async () => {
    try {
        console.log('Variables de entorno cargadas. Intentando conectar a DB...');

        // 1. Conectar a la base de datos y esperar la conexión
        await connectDB();

        // 2. Iniciar el servidor Express solo después de una conexión exitosa
        app.listen(PORT, () => {
            console.log(`⚡️ Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        // 3. Manejo de errores de conexión críticos
        console.error('❌ FALLO CRÍTICO AL INICIAR EL SERVIDOR O CONECTAR A DB:', error);
        process.exit(1);
    }
};

startServer(); // ⬅️ Llamamos a la función de inicio