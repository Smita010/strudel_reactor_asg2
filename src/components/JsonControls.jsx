import React, { useRef } from "react";


//This component handles saving and loading the user’s settings as JSON
export default function JsonControls({ uiState, onLoadState }) {
    const fileInputRef = useRef(null);

    // Save current UI state to a JSON file
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

    // Load UI state from a selected JSON file
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

                {/* Hidden input for selecting JSON files */}
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
