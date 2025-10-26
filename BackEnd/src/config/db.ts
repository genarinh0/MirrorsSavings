// src/config/db.ts (CORREGIDO PARA EVITAR ERRORES DE ASIGNACIÓN)

import mongoose from 'mongoose';

const connectDB = async () => {
  // TS2580: El acceso a process.env ahora es reconocido por @types/node
  const uri = process.env.MONGO_URI; 

  if (!uri) {
    console.error('Error: MONGO_URI no está definida en el archivo .env.');
    process.exit(1);
  }

  try {
    // ⬅️ Corrección de TS2345: Usamos un objeto de opciones vacío, ya que las propiedades
    // como serverSelectionTimeoutMS y socketTimeoutMS ya no se necesitan
    // en versiones recientes, o Mongoose las maneja por defecto.
    await mongoose.connect(uri); 
    
    console.log('🔗 Conexión a MongoDB establecida exitosamente.');
  } catch (error) {
    console.error('❌ Fallo la conexión a MongoDB. Verifique MONGO_URI y Network Access:', error);
    process.exit(1);
  }
};

export default connectDB;
