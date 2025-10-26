// src/config/db.ts
import mongoose from 'mongoose';
const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('Error: MONGO_URI no está definida en el archivo .env.');
        process.exit(1); // Sale del proceso si no hay URI
    }
    try {
        // Intenta conectar a la base de datos
        await mongoose.connect(uri);
        console.log('🔗 Conexión a MongoDB establecida exitosamente.');
    }
    catch (error) {
        console.error('❌ Fallo la conexión a MongoDB:', error);
        process.exit(1); // Sale del proceso en caso de fallo
    }
};
export default connectDB;
