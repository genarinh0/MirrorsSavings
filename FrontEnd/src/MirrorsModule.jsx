import React, { useState, useEffect } from "react";
import { Header } from "./Header";
import { SideMenu } from "./SideMenu";
import { AddGastoModal } from "./AddGastoModal";
import { HistoryScreen } from "./HistoryScreen";
import { executeMirrorSavings, getInitialData, saveTransaction } from "./utils/api";

export default function MirrorsModule() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMirrorsActive, setIsMirrorsActive] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Saldo y ahorro del cliente único (cargados de MongoDB)
    const [ahorroTotal, setAhorroTotal] = useState(null);
    const [saldoNormal, setSaldoNormal] = useState(null);

    // gastoStatus: 'idle', 'loading', 'success', 'error', 'normal', 'parcial'
    const [gastoStatus, setGastoStatus] = useState("idle");
    const [currentPage, setCurrentPage] = useState('dashboard');

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await getInitialData();
                setAhorroTotal(data.ahorroTotal);
                setSaldoNormal(data.saldoNormal);
            } catch (error) {
                console.error("Failed to load initial Data:", error);
                setAhorroTotal(0.00);
                setSaldoNormal(10000.00);
            }
        };
        loadInitialData();
    }, []);

    // Lógica de registro de gasto
    const handleGuardarGasto = async (monto, categoria, establecimiento) => {
        if (!isMirrorsActive) {
            alert("Savings function is deactivated");
            setIsModalOpen(false);
            return;
        }

        setGastoStatus("loading");

        let successMessage = "Expense Registered";
        let result = { validation: 'SKIP', transferredAmount: 0, message: 'Error' };

        try {
            result = await executeMirrorSavings(monto, categoria, establecimiento);

            const transferred = parseFloat(result.transferredAmount);

            if (result.validation === "SUCCESS") {
                successMessage = result.message;
                setGastoStatus("success");

                const updatedData = await getInitialData();
                setAhorroTotal(updatedData.ahorroTotal);
                setSaldoNormal(updatedData.saldoNormal);

            } else if (result.validation === "SKIP") {
                successMessage = result.message;
                setGastoStatus("normal");

            } else if (result.validation === "FAILED_MIRROR") {
                successMessage = result.message;
                setGastoStatus("parcial");

            } else { // FAILED_BALANCE o error inesperado
                successMessage = result.message;
                setGastoStatus("error");
            }

            await saveTransaction(monto, categoria, establecimiento, result);

        } catch (error) {
            setGastoStatus("error");
            successMessage = `Server Connection Error: ${error.message}`;
            alert(successMessage);
        } finally {
            setTimeout(() => {
                setIsModalOpen(false);
                setGastoStatus("idle");
            }, 2000);
        }
    };

    // =======================================================
    // RENDERIZADO
    // =======================================================

    const renderPage = () => {
        if (ahorroTotal === null || saldoNormal === null) {
            return <div className="main-content-centered"><div className="loader"></div></div>;
        }

        switch (currentPage) {
            case 'history':
                return <HistoryScreen onClose={() => setCurrentPage('dashboard')} />;
            case 'dashboard':
            default:
                return (
                    <div className="main-content-centered">
                        <h1>Mirror Savings</h1>
                        <p>Powered by Machine Learning. Every expense is intelligently analyzed.</p>

                        {/* Botón Principal */}
                        <button
                            className="boton-grande-principal"
                            onClick={() => setIsModalOpen(true)}
                            disabled={gastoStatus === "loading" || !isMirrorsActive}
                        >
                            {!isMirrorsActive ? "Function Deactivated" : "+ Register     Expense"}
                        </button>

                        {/* Tarjetas de Saldo Persistente */}
                        <div className="card-estado-cuentas">
                            <h4 style={{ color: '#007bff' }}>Account State (Persistent)</h4>
                            <div style={{ padding: '10px 0', borderTop: '1px solid #f0f0f0' }}>
                                <p>Regular Balance:</p>
                                <strong style={{ color: '#1a1a1a' }}>${saldoNormal.toFixed(2)}</strong>
                            </div>
                            <div style={{ padding: '10px 0' }}>
                                <p>Total Savings:</p>
                                <strong style={{ color: '#28a745' }}>${ahorroTotal.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                );
        }
    };


    return (
        <div className="dashboard-container">
            {isModalOpen && (
                <AddGastoModal
                    status={gastoStatus}
                    onClose={() => setIsModalOpen(false)}
                    onGastoGuardado={handleGuardarGasto}
                />
            )}

            {isMenuOpen && (
                <SideMenu
                    ahorro={ahorroTotal}
                    saldo={saldoNormal}
                    onClose={() => setIsMenuOpen(false)}
                    onNavigateHistory={() => {
                        setIsMenuOpen(false);
                        setCurrentPage('history');
                    }}
                />
            )}

            <Header
                onMenuClick={() => setIsMenuOpen(true)}
                isMirrorsOn={isMirrorsActive}
                onToggleChange={() => setIsMirrorsActive(!isMirrorsActive)}
            />

            {renderPage()}

        </div>
    );
}