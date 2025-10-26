// src/config/db.ts

import mongoose from 'mongoose';

const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('Error: MONGO_URI no está definida en el archivo .env.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });

        console.log('🔗 Conexión a MongoDB establecida exitosamente.');
    } catch (error) {
        console.error('❌ Fallo la conexión a MongoDB. Verifique MONGO_URI y Network Access:', error);
        process.exit(1);
    }
};

export default connectDB;