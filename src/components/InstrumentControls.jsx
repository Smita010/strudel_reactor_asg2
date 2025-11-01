import React from "react";

export default function InstrumentControls({ onToggle }) {
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5 className="text-primary">Instrument 1 (p1)</h5>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onChange={onToggle}
                        defaultChecked
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        p1: ON
                    </label>
                </div>
                <div className="form-check mt-2">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onChange={onToggle}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        p1: HUSH
                    </label>
                </div>
            </div>
        </div>
    );
}
