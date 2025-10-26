export interface Purchase {
    _id: string;
    type: 'purchase';
    purchase_date: string;
    amount: number;
    description: string;
    status: string;
    merchant_id: string;
    account_id: string;
}

export interface Transfer {
    _id: string;
    type: 'transfer';
    transaction_date: string;
    amount: number;
    description: string;
    status: string;
    payer_id: string;
    payee_id: string;
}

export interface Account {
    _id: string;
    type: string;
    nickname: string;
    rewards: number;
    balance: number;
    customer_id: string;
}

export interface SavingsProcessResult {
    message: string;
    transferredAmount: string | number;
    purchasesCount?: number;
    transferId?: string;
    // ⬅️ ¡CORRECCIÓN! Añadimos el nuevo estado del caso de borde
    validation?: 'SUCCESS' | 'FAILED_BALANCE' | 'SKIP' | 'FAILED_MIRROR';
}