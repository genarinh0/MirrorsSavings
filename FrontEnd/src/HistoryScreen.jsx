import React, { useState, useEffect } from "react";
import { getHistory } from "./utils/api";

// Helper para traducir el estado de validación a texto y color (de styles.css)
const statusStyles = {
    SUCCESS: { text: "Savings applied", color: "#28a745" }, // Verde
    FAILED_MIRROR: { text: "OK Expense, Failed to add savings", color: "#ffc107" }, // Amarillo
    SKIP: { text: "Regular Expense", color: "#6c757d" }, // Gris
    FAILED_BALANCE: { text: "Transaction Rejected", color: "#dc3545" }, // Rojo
};

export function HistoryScreen({ onClose }) {
    const [history, setHistory] = useState(null); // Usamos null para 'cargando'
    const [loading, setLoading] = useState(true);

    // Efecto para cargar el historial al montar el componente
    useEffect(() => {
        const loadHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data);
            } catch (error) {
                console.error("Error al cargar el historial:", error);
                setHistory([]); // Establecer array vacío en caso de fallo
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(amount);
    };

    const renderStatus = (statusKey) => {
        const style = statusStyles[statusKey] || statusStyles.FAILED_BALANCE;
        return (
            <span
                style={{
                    color: style.color,
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                }}
            >
        {style.text}
      </span>
        );
    };

    return (
        <div className="history-container">
            <button onClick={onClose} className="back-button">
                {"< Volver"}
            </button>
            <h1 style={{ textAlign: "center" }}>Transaction History</h1>

            {loading && <p style={{ textAlign: "center" }}>Loading transactions...</p>}

            {!loading && history && history.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "40px" }}>
                    No expenses registered yet. Start saving now!
                </p>
            )}

            {!loading && history && history.length > 0 && (
                <table className="history-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount Spent</th>
                        <th>Amount Mirrored</th>
                        <th>State</th>
                        <th>Establishment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((tx) => {
                        // Determinamos el estado final basado en la validación guardada
                        const statusKey = tx.validation || "SKIP"; // Usamos el validation del backend

                        return (
                            <tr key={tx._id}>
                                <td>{new Date(tx.fecha).toLocaleDateString()}</td>
                                <td style={{ color: "#dc3545", fontWeight: "bold" }}>
                                    -{formatCurrency(tx.monto)}
                                </td>
                                <td style={{ color: "#28a745", fontWeight: "bold" }}>
                                    +{formatCurrency(tx.transferAmount)}
                                </td>
                                <td>{renderStatus(statusKey)}</td>
                                <td>{tx.establecimiento}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}
        </div>
    );
}