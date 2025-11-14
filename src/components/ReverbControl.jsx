import React from "react";

export default function ReverbControl({ value, onChange }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5 className="text-primary mb-2">Reverb Amount</h5>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="form-range"
                />
                <small className="text-muted">0 = dry, 1 = very reverby</small>
            </div>
        </div>
    );
}
