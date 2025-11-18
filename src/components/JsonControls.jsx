import React, { useRef } from "react";

export default function JsonControls({ uiState, onLoadState }) {
    const fileInputRef = useRef(null);

    const handleSave = () => {
        const dataStr = JSON.stringify(uiState, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "strudel_settings.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleLoad = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const loaded = JSON.parse(e.target.result);
                onLoadState(loaded);
            } catch (err) {
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="json-controls-wrapper">
            <h5 className="json-title">Save / Load Settings</h5>

            <div className="json-button-row">
                <button className="json-btn" onClick={handleSave}>
                    Save JSON
                </button>

                <button
                    className="json-btn"
                    onClick={() => fileInputRef.current.click()}
                >
                    Load JSON
                </button>

                <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    onChange={handleLoad}
                    style={{ display: "none" }}
                />
            </div>
        </div>
    );
}
