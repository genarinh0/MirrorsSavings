// src/models/Customer.ts
import mongoose, { Schema, Document } from 'mongoose';
// Esquema de Mongoose
const CustomerSchema = new Schema({
    nessieCustomerId: { type: String, required: true, unique: true },
    savingsThreshold: { type: Number, required: true, default: 5.00 },
    isActive: { type: Boolean, required: true, default: true },
});
// Exporta el modelo
export default mongoose.model('Customer', CustomerSchema);
