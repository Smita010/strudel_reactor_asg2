import React from "react";
import PlaybackControls from "./PlaybackControls";
import TempoControl from "./TempoControl";
import InstrumentControls from "./InstrumentControls";
import InstrumentSelector from "./InstrumentSelector";
import ArpSelector from "./ArpSelector";
import ReverbControl from "./ReverbControl";
import { globalEditor } from "./StrudelEnvironment";

export default function ControlPanel({
    uiState,
    text,
    setBpm,
    setP1Mode,
    setInstrument,
    setReverb,
    setArpMode,
    setMaster,
    setIsPlaying,
    applyAndPlay,
    applyPreprocessing,
}) {
    const { bpm, reverb, arpMode, master } = uiState;

    return (
        <div className="col-md-2 playback-column">
            {/* Basic play / stop / preprocess buttons */}
            <PlaybackControls
                onProcess={() => applyPreprocessing(globalEditor, uiState, text)}
                onProcessPlay={() => {
                    applyAndPlay(globalEditor, uiState, text);
                    setIsPlaying(true);
                }}
                onPlay={() => {
                    globalEditor?.evaluate();
                    setIsPlaying(true);
                }}
                onStop={() => {
                    globalEditor?.stop();
                    setIsPlaying(false);
                }}
            />

            {/* Tempo slider. Also updates Strudel's cycles-per-second value. */}
            <TempoControl
                onChange={(value) => {
                    setBpm(value);
                    if (typeof window.setcps === "function") {
                        window.setcps(value / 60 / 3);
                    }
                }}
            />

            {/* p1 ON/HUSH radio buttons */}
            <InstrumentControls
                onToggle={(mode) => {
                    setP1Mode(mode);
                    applyAndPlay(globalEditor, { ...uiState, p1: mode }, text);
                }}
            />

            {/* Dropdown to switch the main instrument */}
            <InstrumentSelector
                onChange={(value) => {
                    setInstrument(value);
                    applyAndPlay(globalEditor, { ...uiState, instrument: value }, text);
                }}
            />

            {/* Arpeggiator mode selector */}
            <ArpSelector
                value={arpMode}
                onChange={(value) => {
                    setArpMode(value);
                    applyAndPlay(globalEditor, { ...uiState, arpMode: value }, text);
                }}
            />

            {/* Reverb amount slider */}
            <ReverbControl
                value={reverb}
                onChange={(v) => {
                    setReverb(v);
                    applyAndPlay(globalEditor, { ...uiState, reverb: v }, text);
                }}
            />

            {/* Master volume slider */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <label className="form-label">Master Volume</label>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={master}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setMaster(val);
                            applyAndPlay(globalEditor, { ...uiState, master: val }, text);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
