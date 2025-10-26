import React, { useState } from "react";

// ¡Exportamos la función!
export function AddGastoModal({ status, onClose, onGastoGuardado }) {
    const [monto, setMonto] = useState("");
    const [categoria, setCategoria] = useState("");
    const [establecimiento, setEstablecimiento] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!monto || !categoria || !establecimiento || monto <= 0) {
            alert("Please fill in every field");
            return;
        }
        onGastoGuardado(parseFloat(monto), categoria, establecimiento);
    };

    // Función para mostrar animación
    const renderContent = () => {
        switch (status) {
            case "loading":
                return (
                    <div className="animation-container">
                        <div className="loader"></div>
                        <p style={{ marginTop: "15px" }}>Analyzing with ML...</p>
                    </div>
                );
            case "success":
                return (
                    <div className="animation-container">
                        <div className="status-icon icon-success">✓</div>
                        <p style={{ marginTop: "15px", color: '#28a745', fontWeight: 'bold' }}>Mirror Savings Executing!</p>
                    </div>
                );
            case "normal":
                return (
                    <div className="animation-container">
                        <div className="status-icon icon-normal">✓</div>
                        <p style={{ marginTop: "15px", color: '#17a2b8', fontWeight: 'bold' }}>Regular spending applied. No Mirror Savings.</p>
                    </div>
                );
            case "parcial": // FAILED_MIRROR
                return (
                    <div className="animation-container">
                        <div className="status-icon icon-parcial">!</div>
                        <p style={{ marginTop: "15px", color: '#ffc107', fontWeight: 'bold' }}>Purchase approved, but no funds to mirror.</p>
                    </div>
                );
            case "error": // FAILED_BALANCE o error de red
                return (
                    <div className="animation-container">
                        <div className="status-icon icon-error">X</div>
                        <p style={{ marginTop: "15px", color: '#dc3545', fontWeight: 'bold' }}>Transaction rejected. Insufficient balance.</p>
                    </div>
                );

            // Formulario por defecto
            default:
                return (
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <button type="button" onClick={onClose} className="modal-close-btn">
                            X
                        </button>
                        <h3 className="text-2xl font-bold text-center">Log expenses</h3>

                        {/* Campo Monto */}
                        <div className="form-group">
                            <label htmlFor="monto">Amount Spent:</label>
                            <div className="monto-input-wrapper">
                                <span>$</span>
                                <input
                                    type="number"
                                    id="monto"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    placeholder="5.00"
                                />
                            </div>
                        </div>

                        {/* Campo Establecimiento */}
                        <div className="form-group">
                            <label htmlFor="establecimiento">Establishment:</label>
                            <input
                                type="text"
                                id="establecimiento"
                                value={establecimiento}
                                onChange={(e) => setEstablecimiento(e.target.value)}
                                placeholder="Ej: OXXO, Starbucks"
                                style={{width: "100%", padding: "12px", boxSizing: "border-box", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem"}}
                            />
                        </div>

                        {/* Campo Categoría */}
                        <div className="form-group">
                            <label htmlFor="categoria">Category:</label>
                            <select
                                id="categoria"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none bg-white"
                            >
                                <option value="">-- Select an Option --</option>
                                <option value="cafe">☕ Coffee</option>
                                <option value="comida_rapida">🍔 Fast Food</option>
                                <option value="transporte">🚕 Transportation</option>
                                <option value="antojo">🍫 Quick Snack</option>
                                <option value="otro">🛒 Other</option>
                            </select>
                        </div>

                        <button type="submit" className="boton-guardar">
                            Save and Submit
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">{renderContent()}</div>
        </div>
    );
}