// src/server.ts
// src/server.ts
import express from 'express';
import * as dotenv from 'dotenv';
import connectDB from './config/db.js';
import savingsRoutes from './routes/savingsRoutes.js';
dotenv.config();
console.log('Variables de entorno cargadas. Verificando MONGO_URI...');
console.log('URI:', process.env.MONGO_URI ? 'Cargada' : 'No cargada');
//console.log('Nessie Key:', process.env.NESSY_API_KEY ? 'Cargada' : 'No cargada');
connectDB(); // ⬅️ Ejecutamos la conexión
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Ruta de Salud
app.get('/', (req, res) => {
    res.status(200).send('Servidor Ahorro Hormiga funcionando!');
});
// Rutas del proyecto
app.use('/api/savings', savingsRoutes);
app.listen(PORT, () => {
    console.log(`⚡️ Servidor corriendo en http://localhost:${PORT}`);
});
