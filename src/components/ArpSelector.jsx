import React from "react";

// Simple dropdown component for choosing the arpeggiator mode.
// The parent passes in the current value and an onChange callback.
export default function ArpSelector({ value, onChange }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5>Arpeggiator Mode</h5>
                <select
                    className="form-select"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="arp1">Arp 1</option>
                    <option value="arp2">Arp 2</option>
                    <option value="combo">Arp Combo</option>
                </select>
            </div>
        </div>
    );
}
