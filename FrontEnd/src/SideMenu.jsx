import React from "react";

// Usamos 'export function' porque lo importas con { }
export function SideMenu({ ahorro, saldo, onClose, onNavigateHistory }) {
    return (
        <div className="sidemenu-backdrop" onClick={onClose}>
            <div className="sidemenu" onClick={(e) => e.stopPropagation()}>
                
                <button onClick={onClose} className="sidemenu-close-btn">
                    X
                </button>
                <h1 className="Cuenta">My Accounts</h1>
                <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                    <p>Regular Balance:</p>
                    {/* Usamos el operador de coalescencia nula (?? 0) para evitar que el render falle si saldo es null */}
                    <h4>${(saldo ?? 0).toFixed(2)}</h4>
                    <p>Mirror Savings:</p>
                    {/* Usamos el operador de coalescencia nula (?? 0) para evitar que el render falle si ahorro es null */}
                    <h4>${(ahorro ?? 0).toFixed(2)}</h4>
                </div>

                {/* Botón de Navegación al Historial */}
                <button
                    onClick={onNavigateHistory}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#e6f2ff',
                        color: '#007bff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Spending History
                </button>

            </div>
        </div>
    );
}