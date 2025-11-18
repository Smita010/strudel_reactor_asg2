import React from "react";


//  Radio buttons for turning the first instrument (p1) on or off
export default function InstrumentControls({ onToggle }) {
    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h5>Instrument 1 (p1)</h5>

                {/* Radio button for enabling p1 */}
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                        onChange={() => onToggle("on")}
                        defaultChecked
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault1">
                        p1: ON
                    </label>
                </div>

                {/* Radio button for muting p1 */}
                <div className="form-check mt-2">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                        onChange={() => onToggle("hush")}
                    />
                    <label className="form-check-label" htmlFor="flexRadioDefault2">
                        p1: HUSH
                    </label>
                </div>
            </div>
        </div>
    );
}
