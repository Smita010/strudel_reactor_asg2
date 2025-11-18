import React from "react";

//   Simple slider for adjusting the tempo (BPM) of the track.
export default function TempoControl({ onChange }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5>Tempo Control</h5>
                <input
                    type="range"
                    className="form-range"
                    id="tempoRange"
                    min="60"
                    max="180"
                    defaultValue="120"
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
