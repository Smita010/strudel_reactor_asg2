import React from "react";
export default function PlaybackControls({ onProcess, onProcessPlay, onPlay, onStop }) {
    return (
        <div className="card shadow-sm mb-3">
            <div className="card-body text-center">
                <h5 className="text-primary mb-3">Playback Controls</h5>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <button onClick={onProcess} className="btn btn-sm">
                        Preprocess
                    </button>

                    <button onClick={onProcessPlay} className="btn btn-sm">
                        Proc & Play
                    </button>

                    <button onClick={onPlay} className="btn btn-sm">
                        Play
                    </button>

                    <button onClick={onStop} className="btn btn-sm">
                        Stop
                    </button>
                </div>
            </div>
        </div>
    );
}
