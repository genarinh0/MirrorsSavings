import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    // Identificador del cliente
    nessieCustomerId: { type: String, required: true, index: true },

    // Datos del gasto
    monto: { type: Number, required: true },
    categoria: { type: String, required: true },
    establecimiento: { type: String, required: true },
    fecha: { type: Date, default: Date.now },

    // Datos del algoritmo Mirrors
    isHormiga: { type: Boolean, required: true },
    transferAmount: { type: Number, required: true },
    validation: { type: String, required: true }, // SUCCESS, SKIP, FAILED_MIRROR, FAILED_BALANCE
    message: { type: String, required: true },
});

// El nombre 'Transaction' creará la colección 'transactions' en MongoDB
const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;