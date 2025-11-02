import React from "react";

export default function InstrumentSelector({ onChange }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body">
                <h5 className="text-primary mb-2">Select Instrument</h5>
                <select
                    id="instrumentSelect"
                    className="form-select"
                    onChange={(e) => {
                        const instrument = e.target.value;
                        console.log("Instrument changed to:", instrument);
                        onChange(instrument);
                    }}
                >
                    <option value="supersaw">Supersaw</option>
                    <option value="bass">Bass</option>
                    <option value="drums">Drums</option>
                </select>
            </div>
        </div>
    );
}
