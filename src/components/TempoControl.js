import React from "react";

export default function TempoControl({ onChange }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5 className="text-primary mb-2">Tempo Control</h5>
                <label htmlFor="tempoRange" className="form-label">Tempo (BPM)</label>
                <input
                    type="range"
                    className="form-range"
                    id="tempoRange"
                    min="60"
                    max="180"
                    defaultValue="120"
                    onChange={(e) => onChange(e.target.value)}
                />
                <small className="text-muted">Adjust tempo between 60 - 180 BPM</small>
            </div>
        </div>
    );
}
