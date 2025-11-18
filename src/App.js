import './App.css';
import React, { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch from './console-monkey-patch';
import PreprocessorEditor from './components/PreprocessorEditor';
import PlaybackControls from "./components/PlaybackControls";
import InstrumentControls from "./components/InstrumentControls";
import TempoControl from "./components/TempoControl";
import InstrumentSelector from "./components/InstrumentSelector";
import D3Graph from "./components/D3Graph";
import ReverbControl from "./components/ReverbControl";
import ArpSelector from "./components/ArpSelector";
import { applyPreprocessing, applyAndPlay } from "./utils/preprocessor";

let globalEditor = null;

export default function StrudelDemo() {
    const hasRun = useRef(false);
    const [text, setText] = useState('<p1_Radio> ' + stranger_tune);
    const [bpm, setBpm] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [p1Mode, setP1Mode] = useState("on");
    const [instrument, setInstrument] = useState("supersaw");
    const [reverb, setReverb] = useState(0.4);
    const [arpMode, setArpMode] = useState("arp1");
    const [master, setMaster] = useState(1);

    const uiState = {
        p1: p1Mode,
        instrument,
        bpm,
        isPlaying,
        reverb,
        arpMode,
        master
    };

    useEffect(() => {
        if (!hasRun.current) {
            hasRun.current = true;
            console_monkey_patch();

            document.addEventListener("d3Data", (event) => {
                console.log(event.detail);
            });
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2];
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) =>
                    drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),

                prebake: async () => {
                    initAudioOnFirstClick();
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });

            applyPreprocessing(globalEditor, uiState, stranger_tune);
        }
    }, []); 

    return (
        <div>
            <h2 className="text-center mb-3">Strudel Demo</h2>
            <main>
                <div className="row">
                    <div className="col-md-10">
                        <D3Graph bpm={bpm} isPlaying={isPlaying} />
                        <div className="editor-panels">
                            <div className="editor-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="text-primary">Preprocessor Editor</h5>
                                        <PreprocessorEditor value={text} onChange={setText} />
                                    </div>
                                </div>
                            </div>
                            <div className="editor-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="text-primary">Live Strudel Output</h5>
                                        <div id="editor"></div>
                                        <div id="output"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 playback-column">
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
                        <TempoControl
                            onChange={(value) => {
                                setBpm(value);
                                if (typeof window.setcps === "function") {
                                    window.setcps(value / 60 / 4);
                                }
                            }}
                        />
                        <InstrumentControls
                            onToggle={(mode) => {
                                setP1Mode(mode);
                                applyAndPlay(globalEditor, { ...uiState, p1: mode }, text);
                            }}
                        />
                        <InstrumentSelector
                            onChange={(value) => {
                                setInstrument(value);
                                applyAndPlay(globalEditor, { ...uiState, instrument: value }, text);
                            }}
                        />
                        <ArpSelector
                            value={arpMode}
                            onChange={(value) => {
                                setArpMode(value);
                                applyAndPlay(globalEditor, { ...uiState, arpMode: value }, text);
                            }}
                        />
                        <ReverbControl
                            value={reverb}
                            onChange={(v) => {
                                setReverb(v);
                                applyAndPlay(globalEditor, { ...uiState, reverb: v }, text);
                            }}
                        />
                        <div className="card shadow-sm p-2 mb-2">
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
                <canvas id="roll" className="mt-4"></canvas>
            </main>
        </div>
    );
}