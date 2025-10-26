// src/models/Customer.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    nessieCustomerId: string;
    saldoNormal: number;
    ahorroTotal: number;
    isActive: boolean;
}

const CustomerSchema: Schema = new Schema({
    nessieCustomerId: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true, default: true },
    saldoNormal: { type: Number, default: 10000.00 },
    ahorroTotal: { type: Number, default: 0.00 },
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);